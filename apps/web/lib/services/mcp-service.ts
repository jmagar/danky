import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { MemorySaver } from '@langchain/langgraph'
import { HumanMessage } from '@langchain/core/messages'
import { convertMCPServersToLangChainTools, type MCPServerCleanupFunction } from '@danky/mcp/servers/mcp-server-langchain-tool'
import { initChatModel } from '@danky/mcp/init-chat-model'
import { type Config } from '@danky/mcp/load-config'
import { Logger, LogLevel, type LogLevelString } from '@danky/mcp/logger'
import { loadMCPConfig } from '../config/mcp-config'

export interface MCPServiceConfig {
  logLevel?: LogLevelString
}

export class MCPService {
  private config: Config | null = null
  private agent: ReturnType<typeof createReactAgent> | null = null
  private cleanup: MCPServerCleanupFunction | null = null
  private logger: Logger
  private llmInitialized: boolean = false
  private serverStatus: Record<string, { status: 'connected' | 'disconnected' | 'error'; error?: string }> = {}

  constructor(options: MCPServiceConfig = {}) {
    this.logger = new Logger({ level: options.logLevel || 'debug' })
  }

  async initialize(): Promise<void> {
    try {
      this.logger.info('Starting MCP Service initialization')
      
      // Load and validate config
      this.logger.info('Loading MCP configuration')
      try {
        const config = loadMCPConfig()
        this.config = config
        this.logger.info('Configuration loaded successfully')
      } catch (error) {
        this.logger.error('Failed to load configuration')
        throw error
      }

      // Initialize LLM
      this.logger.info('Initializing LLM model')
      const llmModel = initChatModel(this.config.llm)
      this.llmInitialized = true

      // Initialize MCP servers
      this.logger.info('Initializing MCP servers')
      
      // Initialize server status to disconnected
      Object.keys(this.config.mcpServers).forEach(serverName => {
        this.logger.info(`Setting initial status for server "${serverName}" to disconnected`)
        this.serverStatus[serverName] = { status: 'disconnected' }
      })

      try {
        this.logger.info('Converting MCP servers to LangChain tools...')
        this.logger.info('Server configurations:', JSON.stringify(this.config.mcpServers, null, 2))
        
        const { allTools, cleanup } = await convertMCPServersToLangChainTools(
          this.config.mcpServers,
          { logLevel: LogLevel[this.logger['level']].toLowerCase() as LogLevelString }
        )
        this.cleanup = cleanup
        this.logger.info(`Successfully converted servers to ${allTools.length} LangChain tools`)

        // Update status for successfully initialized servers based on tools
        const connectedServers = new Set(allTools.map(tool => {
          this.logger.debug(`Processing tool: ${tool.name}`)
          const [serverId] = tool.name.split('/')
          this.logger.debug(`Extracted server ID "${serverId}" from tool "${tool.name}"`)
          return serverId
        }))
        
        this.logger.debug('Connected servers from tool names:', Array.from(connectedServers))
        
        Object.keys(this.config.mcpServers).forEach(serverName => {
          const hasToolWithPrefix = allTools.some(tool => {
            const matches = tool.name.startsWith(`${serverName}/`)
            this.logger.debug(`Checking if tool "${tool.name}" belongs to server "${serverName}": ${matches}`)
            return matches
          })
          const isConnected = connectedServers.has(serverName) || hasToolWithPrefix
          this.logger.info(`Updating status for server "${serverName}" to ${isConnected ? 'connected' : 'disconnected'} (has tools: ${hasToolWithPrefix})`)
          this.serverStatus[serverName] = isConnected 
            ? { status: 'connected' }
            : { status: 'disconnected' }
        })

        // Create React agent with all tools
        this.logger.info(`Creating React agent with ${allTools.length} tools:`)
        allTools.forEach(tool => {
          this.logger.info(`- ${tool.name}: ${tool.description}`)
        })
        this.agent = createReactAgent({
          llm: llmModel,
          tools: allTools,
          checkpointSaver: new MemorySaver(),
        })
        this.logger.info('React agent created successfully')
      } catch (error) {
        // Parse the error message to identify which servers failed
        const errorMessage = error instanceof Error ? error.message : String(error)
        this.logger.error('Error during server initialization:', errorMessage)
        
        Object.keys(this.config.mcpServers).forEach(serverName => {
          if (errorMessage.includes(`MCP server "${serverName}": failed to initialize`)) {
            this.logger.error(`Server "${serverName}" failed to initialize`)
            this.serverStatus[serverName] = { 
              status: 'error',
              error: errorMessage
            }
          }
        })

        this.logger.error('Failed to initialize some MCP servers:', error)
        this.logger.info('Attempting to continue with any successfully initialized tools...')
        
        // Try to continue with any tools that did initialize
        const { allTools = [], cleanup } = await convertMCPServersToLangChainTools(
          this.config.mcpServers,
          { 
            logLevel: LogLevel[this.logger['level']].toLowerCase() as LogLevelString,
            continueOnError: true
          }
        ).catch((e) => {
          this.logger.error('Failed to initialize any tools:', e)
          return { allTools: [], cleanup: null }
        })
        
        this.cleanup = cleanup
        this.logger.info(`Creating React agent with ${allTools.length} working tools:`)
        allTools.forEach(tool => {
          this.logger.info(`- ${tool.name}: ${tool.description}`)
        })
        this.agent = createReactAgent({
          llm: llmModel,
          tools: allTools,
          checkpointSaver: new MemorySaver(),
        })
        this.logger.info('React agent created with partial tool set')
      }

      this.logger.info('MCP Service initialization complete')
      this.logger.info('Final server status:', JSON.stringify(this.serverStatus, null, 2))
    } catch (error) {
      this.logger.error('Failed to initialize MCP Service')
      if (error instanceof Error) {
        this.logger.error('Error:', error.message)
      }
      throw error
    }
  }

  isPartiallyInitialized(): boolean {
    return this.llmInitialized && this.agent !== null
  }

  async processMessage(message: string): Promise<string> {
    if (!this.agent) {
      throw new Error('MCP Service not initialized')
    }

    try {
      this.logger.info('Processing message')
      
      // Check if message is requesting a specific tool
      const braveSearchMatch = message.match(/brave_web_search|brave[\s_-]search/i)
      if (braveSearchMatch) {
        if (this.serverStatus['brave-search']?.status !== 'connected') {
          return "I apologize, but the Brave Search tool is not currently available. Please try again later or use a different tool."
        }
        // Add context to help the agent use the Brave Search tool
        message = `Use the Brave Search tool to ${message}`
      }

      const weatherMatch = message.match(/weather/i)
      if (weatherMatch) {
        if (this.serverStatus['weather']?.status !== 'connected') {
          return "I apologize, but the Weather tool is not currently available. Please try again later or use a different tool."
        }
        // Add context to help the agent use the Weather tool
        message = `Use the Weather tool to ${message}`
      }

      // Check if the message is explicitly requesting filesystem operations
      const fileSystemMatch = message.match(/file|directory|read|write|search files?|list files?/i)
      if (!fileSystemMatch && this.serverStatus['filesystem']?.status === 'connected') {
        // If not explicitly requesting filesystem operations, prevent filesystem tool usage
        message = `Do not use filesystem tools unless explicitly requested. ${message}`
      }

      this.logger.info('Modified message:', message)

      const agentFinalState = await this.agent.invoke(
        { messages: [new HumanMessage(message)] },
        { configurable: { thread_id: 'web-thread' } }
      )

      const response = agentFinalState.messages[agentFinalState.messages.length - 1].content as string
      this.logger.info('Message processed')
      return response
    } catch (error) {
      this.logger.error('Error processing message')
      if (error instanceof Error) {
        this.logger.error('Error:', error.message)
      }
      throw error
    }
  }

  async shutdown(): Promise<void> {
    if (this.cleanup) {
      try {
        this.logger.info('Shutting down MCP Service')
        await this.cleanup()
        this.logger.info('MCP Service shut down')
      } catch (error) {
        this.logger.error('Error during shutdown')
        if (error instanceof Error) {
          this.logger.error('Error:', error.message)
        }
        throw error
      }
    }
  }

  getServerStatus(): Record<string, 'connected' | 'disconnected' | 'error'> {
    return Object.entries(this.serverStatus).reduce((acc, [serverId, status]) => {
      acc[serverId] = status.status
      return acc
    }, {} as Record<string, 'connected' | 'disconnected' | 'error'>)
  }

  getAvailableTools(): Array<{ serverId: string; toolId: string; name: string; description: string }> {
    // TODO: Implement tool discovery from connected servers
    return []
  }
} 
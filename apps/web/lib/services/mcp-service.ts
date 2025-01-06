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
        this.logger.info('Configuration loaded successfully', { config: JSON.stringify(config, null, 2) })
      } catch (error) {
        this.logger.error('Failed to load configuration:', error)
        throw error
      }

      // Initialize LLM
      this.logger.info('Initializing LLM model')
      let llmModel
      try {
        llmModel = initChatModel(this.config.llm)
        this.llmInitialized = true
        this.logger.info('LLM model initialized successfully')
      } catch (error) {
        this.logger.error('Failed to initialize LLM model:', error)
        throw error
      }

      // Initialize MCP servers
      this.logger.info('Initializing MCP servers')
      
      // Initialize server status to disconnected
      Object.keys(this.config.mcpServers).forEach(serverName => {
        this.logger.info(`Setting initial status for server "${serverName}" to disconnected`)
        this.serverStatus[serverName] = { status: 'disconnected' }
      })

      try {
        this.logger.info('Converting MCP servers to LangChain tools...')
        
        const { allTools, cleanup } = await convertMCPServersToLangChainTools(
          this.config.mcpServers,
          { 
            logLevel: LogLevel[this.logger['level']].toLowerCase() as LogLevelString,
            continueOnError: true // Always try to continue even if some servers fail
          }
        )
        
        this.cleanup = cleanup
        this.logger.info(`Successfully converted servers to ${allTools.length} LangChain tools`)

        // Update status for successfully initialized servers
        const connectedServers = new Set<string>()
        allTools.forEach(tool => {
          const [serverId] = tool.name.split('_')
          connectedServers.add(serverId)
          this.logger.debug(`Tool "${tool.name}" initialized for server "${serverId}"`)
        })
        
        Object.keys(this.config.mcpServers).forEach(serverName => {
          const isConnected = connectedServers.has(serverName)
          this.logger.info(`Server "${serverName}" status: ${isConnected ? 'connected' : 'disconnected'}`)
          this.serverStatus[serverName] = { 
            status: isConnected ? 'connected' : 'disconnected'
          }
        })

        if (allTools.length === 0) {
          this.logger.warn('No tools were initialized successfully')
        } else {
          // Create React agent with available tools
          this.logger.info('Creating React agent with tools:')
          allTools.forEach(tool => {
            this.logger.info(`- ${tool.name}: ${tool.description}`)
          })
          
          this.agent = createReactAgent({
            llm: llmModel,
            tools: allTools,
            checkpointSaver: new MemorySaver(),
          })
          this.logger.info('React agent created successfully')
        }
      } catch (error) {
        this.logger.error('Error during server initialization:', error)
        
        // Update status for all servers to error
        Object.keys(this.config.mcpServers).forEach(serverName => {
          this.serverStatus[serverName] = { 
            status: 'error',
            error: error instanceof Error ? error.message : String(error)
          }
        })

        // If LLM is initialized, try to create agent without tools
        if (this.llmInitialized) {
          this.logger.info('Creating React agent without tools due to initialization errors')
          this.agent = createReactAgent({
            llm: llmModel,
            tools: [],
            checkpointSaver: new MemorySaver(),
          })
        } else {
          throw error
        }
      }

      this.logger.info('MCP Service initialization complete')
      this.logger.info('Final server status:', this.serverStatus)
    } catch (error) {
      this.logger.error('Failed to initialize MCP Service:', error)
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
        message = `Use the brave_search_web_search tool to ${message}`
      }

      const weatherMatch = message.match(/weather/i)
      if (weatherMatch) {
        if (this.serverStatus['weather']?.status !== 'connected') {
          return "I apologize, but the Weather tool is not currently available. Please try again later or use a different tool."
        }
        // Add context to help the agent use the Weather tool
        message = `Use the weather_get_forecast tool to ${message}`
      }

      // Check if the message is explicitly requesting filesystem operations
      const fileSystemMatch = message.match(/file|directory|read|write|search files?|list files?/i)
      if (!fileSystemMatch && this.serverStatus['filesystem']?.status === 'connected') {
        // If not explicitly requesting filesystem operations, prevent filesystem tool usage
        message = `Do not use filesystem_* tools unless explicitly requested. ${message}`
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
    if (!this.agent) {
      return []
    }

    const tools = (this.agent as any).tools ?? []
    return tools.map((tool: { name: string; description: string }) => {
      const [serverId, toolId] = tool.name.split('/')
      return {
        serverId,
        toolId,
        name: tool.name,
        description: tool.description
      }
    })
  }
} 
import type { LogLevelString } from '@danky/mcp/logger'
import type { DynamicStructuredTool } from '@langchain/core/tools'
import type { BaseChatModel } from '@langchain/core/language_models/chat_models'
import type { MCPConfig } from './load-config'
import { HumanMessage } from '@langchain/core/messages'
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { MemorySaver } from '@langchain/langgraph'

type ServerStatus = 'connected' | 'disconnected' | 'error'

interface MCPServiceOptions {
  logLevel?: LogLevelString
}

export class MCPService {
  private config: MCPConfig | null = null
  private agent: ReturnType<typeof createReactAgent> | null = null
  private tools: DynamicStructuredTool[] = []
  private cleanup: (() => Promise<void>) | null = null
  private llmInitialized = false
  private serverStatus: Record<string, { status: ServerStatus; error?: string }> = {}
  private logger: Console

  constructor(options: MCPServiceOptions = {}) {
    this.logger = console
  }

  async initialize(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Client-side initialization
      this.logger.info('Client-side MCP initialization - deferring to server')
      return
    }

    try {
      this.logger.info('Starting MCP Service initialization')
      
      // Dynamic imports for server-side only
      const { loadMCPConfig } = await import('./load-config')
      const { initChatModel } = await import('./init-chat-model')
      const { convertMCPServersToLangChainTools } = await import('@h1deya/mcp-langchain-tools')
      const { createReactAgent } = await import('@langchain/langgraph/prebuilt')
      const { MemorySaver } = await import('@langchain/langgraph')

      // Load and validate config
      this.logger.info('Loading MCP configuration')
      try {
        const config = loadMCPConfig()
        this.config = config
        this.logger.info('Configuration loaded successfully')
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
        const { tools, cleanup } = await convertMCPServersToLangChainTools(
          this.config.mcpServers,
          { 
            logLevel: 'info'
          }
        )
        
        this.cleanup = cleanup
        this.tools = tools
        this.logger.info(`Successfully converted servers to ${tools.length} LangChain tools`)

        // Update status for successfully initialized servers
        const connectedServers = new Set<string>()
        tools.forEach((tool: DynamicStructuredTool) => {
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

        if (tools.length === 0) {
          this.logger.warn('No tools were initialized successfully')
        } else {
          // Create React agent with available tools
          this.logger.info('Creating React agent with tools:')
          tools.forEach((tool: DynamicStructuredTool) => {
            this.logger.info(`- ${tool.name}: ${tool.description}`)
          })
          
          this.agent = await createReactAgent({
            llm: llmModel,
            tools,
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
          this.agent = await createReactAgent({
            llm: llmModel,
            tools: [],
            checkpointSaver: new MemorySaver(),
          })
        } else {
          throw error
        }
      }

      this.logger.info('MCP Service initialization complete')
    } catch (error) {
      this.logger.error('Failed to initialize MCP Service:', error)
      throw error
    }
  }

  async shutdown(): Promise<void> {
    if (this.cleanup) {
      await this.cleanup()
      this.cleanup = null
    }
    this.agent = null
    this.tools = []
    this.llmInitialized = false
    this.serverStatus = {}
  }

  async processMessage(message: string): Promise<string> {
    if (!this.agent) {
      throw new Error('MCP Service not initialized')
    }
    try {
      const result = await this.agent.invoke({ messages: [new HumanMessage(message)] })
      return result.output
    } catch (error) {
      this.logger.error('Error processing message:', error)
      throw error
    }
  }

  getServerStatus(): Record<string, ServerStatus> {
    return Object.entries(this.serverStatus).reduce(
      (acc, [id, { status }]) => ({ ...acc, [id]: status }),
      {}
    )
  }

  getAvailableTools(): DynamicStructuredTool[] {
    if (!this.agent) return []
    return this.tools
  }

  isPartiallyInitialized(): boolean {
    return this.llmInitialized && this.agent !== null
  }
} 
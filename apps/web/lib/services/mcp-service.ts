import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { MemorySaver } from '@langchain/langgraph'
import { HumanMessage } from '@langchain/core/messages'
import { convertMCPServersToLangChainTools, type MCPServerCleanupFunction } from '@danky/mcp/servers/mcp-server-langchain-tool'
import { initChatModel } from '@danky/mcp/init-chat-model'
import { loadConfig, type Config } from '@danky/mcp/load-config'
import { Logger, LogLevel, type LogLevelString } from '@danky/mcp/logger'
import path from 'path'

export interface MCPServiceConfig {
  configPath?: string
  logLevel?: LogLevelString
}

export class MCPService {
  private config: Config | null = null
  private agent: ReturnType<typeof createReactAgent> | null = null
  private cleanup: MCPServerCleanupFunction | null = null
  private logger: Logger

  constructor(options: MCPServiceConfig = {}) {
    this.logger = new Logger({ level: options.logLevel || 'info' })
  }

  async initialize(configPath: string = path.join(process.cwd(), 'mcp-config.json5')): Promise<void> {
    try {
      // Load and validate config
      this.config = loadConfig(configPath)
      this.logger.info('Loaded MCP configuration')

      // Initialize LLM
      this.logger.info('Initializing LLM model...', this.config.llm)
      const llmModel = initChatModel(this.config.llm)

      // Initialize MCP servers
      this.logger.info(`Initializing ${Object.keys(this.config.mcpServers).length} MCP server(s)...`)
      const { allTools, cleanup } = await convertMCPServersToLangChainTools(
        this.config.mcpServers,
        { logLevel: LogLevel[this.logger['level']].toLowerCase() as LogLevelString }
      )
      this.cleanup = cleanup

      // Create React agent
      this.agent = createReactAgent({
        llm: llmModel,
        tools: allTools,
        checkpointSaver: new MemorySaver(),
      })

      this.logger.info('MCP Service initialized successfully')
    } catch (error) {
      this.logger.error('Failed to initialize MCP Service:', error)
      throw error
    }
  }

  async processMessage(message: string): Promise<string> {
    if (!this.agent) {
      throw new Error('MCP Service not initialized')
    }

    try {
      const agentFinalState = await this.agent.invoke(
        { messages: [new HumanMessage(message)] },
        { configurable: { thread_id: 'web-thread' } }
      )

      return agentFinalState.messages[agentFinalState.messages.length - 1].content as string
    } catch (error) {
      this.logger.error('Error processing message:', error)
      throw error
    }
  }

  async shutdown(): Promise<void> {
    if (this.cleanup) {
      try {
        await this.cleanup()
        this.logger.info('MCP Service shut down successfully')
      } catch (error) {
        this.logger.error('Error during shutdown:', error)
        throw error
      }
    }
  }

  getServerStatus(): Record<string, 'connected' | 'disconnected' | 'error'> {
    if (!this.config) {
      return {}
    }

    // TODO: Implement actual server status tracking
    return Object.keys(this.config.mcpServers).reduce((acc, serverName) => {
      acc[serverName] = 'connected' // Placeholder - we'll implement real status tracking
      return acc
    }, {} as Record<string, 'connected' | 'disconnected' | 'error'>)
  }

  getAvailableTools(): Array<{ serverId: string; toolId: string; name: string; description: string }> {
    // TODO: Implement tool discovery from connected servers
    return []
  }
} 
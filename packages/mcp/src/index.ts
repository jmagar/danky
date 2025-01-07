export * from './init-chat-model'
export * from './load-config'
export * from './logger'

import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { MemorySaver } from '@langchain/langgraph'
import { HumanMessage } from '@langchain/core/messages'
import { convertMCPServersToLangChainTools, type MCPServerCleanupFunction } from '@h1deya/mcp-langchain-tools'
import { initChatModel } from './init-chat-model'
import { loadConfig, type Config } from './load-config'
import { Logger, createLogger } from './logger'

export interface MCPServiceOptions {
  configPath?: string
  logger?: Logger
}

export class MCPService {
  private config: Config | null = null
  private agent: ReturnType<typeof createReactAgent> | null = null
  private cleanup: MCPServerCleanupFunction | null = null
  private logger: Logger

  constructor(options: MCPServiceOptions = {}) {
    this.logger = options.logger || createLogger({ level: 'info' })
  }

  async initialize(): Promise<void> {
    try {
      // Load and validate config
      this.logger.info('Loading MCP configuration')
      const configPath = process.env.CONFIG_FILE || 'mcp-config.json5'
      this.config = loadConfig(configPath)
      this.logger.info('Configuration loaded successfully')

      // Initialize LLM
      this.logger.info('Initializing LLM model')
      const llmModel = initChatModel(this.config.llm)
      this.logger.info('LLM model initialized successfully')

      // Initialize MCP servers
      this.logger.info(`Initializing ${Object.keys(this.config.mcpServers).length} MCP server(s)...`)
      const { tools, cleanup } = await convertMCPServersToLangChainTools(
        this.config.mcpServers,
        { logLevel: 'info' }
      )
      this.cleanup = cleanup

      // Create React agent
      this.agent = createReactAgent({
        llm: llmModel,
        tools,
        checkpointSaver: new MemorySaver(),
      })
      this.logger.info('React agent created successfully')
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
      const result = await this.agent.invoke(
        { messages: [new HumanMessage(message)] },
        { configurable: { thread_id: 'test-thread' } }
      )
      return result.messages[result.messages.length - 1].content
    } catch (error) {
      this.logger.error('Error processing message:', error)
      throw error
    }
  }

  async shutdown(): Promise<void> {
    if (this.cleanup) {
      await this.cleanup()
      this.cleanup = null
    }
    this.agent = null
  }
}

// CLI interface
if (require.main === module) {
  const service = new MCPService()
  service.initialize()
    .then(() => {
      console.log('MCP Service initialized successfully')
      // TODO: Add CLI interface here
    })
    .catch(error => {
      console.error('Failed to initialize MCP Service:', error)
      process.exit(1)
    })
}

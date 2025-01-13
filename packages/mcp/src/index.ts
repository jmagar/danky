import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph';
import { HumanMessage } from '@langchain/core/messages';
import { convertMcpToLangchainTools, type McpServersConfig } from '@h1deya/langchain-mcp-tools';
import { initChatModel } from './init-chat-model';
import { loadConfig, type Config } from './load-config';
import type { Logger, LoggerOptions } from './logger';
import { createLogger } from './logger';

export { createLogger, type Logger, type LoggerOptions };

export interface MCPServiceOptions {
  configPath?: string;
  logger?: Logger;
}

export class MCPService {
  private config: Config | null = null;
  private agent: ReturnType<typeof createReactAgent> | null = null;
  private cleanup: (() => Promise<void>) | null = null;
  private readonly logger: Logger;
  private readonly configPath: string;

  constructor(options: MCPServiceOptions = {}) {
    this.logger = options.logger ?? createLogger({ level: 'info' });
    this.configPath = options.configPath ?? 'mcp-config.json5';
  }

  async initialize(): Promise<void> {
    try {
      // Load and validate config
      this.logger.info('Loading MCP configuration');
      const configPath = process.env['CONFIG_FILE'] ?? this.configPath;
      const config = loadConfig(configPath);
      this.config = config;
      this.logger.info('Configuration loaded successfully');

      // Initialize LLM
      this.logger.info('Initializing LLM model');
      const llmModel = initChatModel(this.config.llm);
      this.logger.info('LLM model initialized successfully');

      // Initialize MCP servers
      const serverCount = Object.keys(this.config.mcpServers).length;
      this.logger.info(`Initializing ${serverCount} MCP server(s)...`);

      // Convert MCP servers to LangChain tools
      const { tools, cleanup } = await convertMcpToLangchainTools(
        this.config.mcpServers as McpServersConfig,
        { logLevel: 'info' }
      );
      this.cleanup = cleanup;
      this.logger.info(`Initialized ${tools.length} MCP tool(s)`);

      // Create React agent
      this.agent = createReactAgent({
        llm: llmModel,
        tools,
        checkpointSaver: new MemorySaver(),
      });
      this.logger.info('React agent created successfully');
    } catch (error) {
      this.logger.error('Failed to initialize MCP Service:', {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      });
      throw error;
    }
  }

  async processMessage(message: string): Promise<string> {
    if (!this.agent) {
      throw new Error('MCP Service not initialized');
    }

    try {
      const result = await this.agent.invoke(
        { messages: [new HumanMessage(message)] },
        { configurable: { thread_id: 'test-thread' } }
      );
      const messages = result['messages'];
      if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error('Invalid response from agent');
      }
      return messages[messages.length - 1].content as string;
    } catch (error) {
      this.logger.error('Error processing message:', {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      });
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    if (this.cleanup) {
      await this.cleanup();
      this.cleanup = null;
    }
    this.agent = null;
  }
}

// Remove CLI interface as it's not being used properly
export { type Config } from './load-config';

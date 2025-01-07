import { MCPService as BaseMCPService, createLogger } from '@danky/mcp'
import path from 'path'

const logger = createLogger({ level: 'debug' })

// Go up two levels from the current file to reach the project root
const PROJECT_ROOT = path.resolve(__dirname, '../../../..')

export class MCPService extends BaseMCPService {
  constructor() {
    super({
      logger,
      configPath: path.join(PROJECT_ROOT, 'mcp-config.json5')
    })
  }

  async initialize(): Promise<void> {
    try {
      await super.initialize()
    } catch (error) {
      logger.error('Failed to initialize MCP Service:', { error })
      throw error
    }
  }
} 
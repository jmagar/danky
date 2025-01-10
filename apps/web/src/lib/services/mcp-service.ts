import { MCPService as BaseMCPService, createLogger } from '@danky/mcp'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const logger = createLogger({ level: 'debug' })

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Go up to the project root (from apps/web/lib/services to root)
const PROJECT_ROOT = path.resolve(__dirname, '../../../..')
logger.debug('Project root:', PROJECT_ROOT)

// Load environment variables from root .env file
const envPath = path.join(PROJECT_ROOT, '.env')
logger.debug('Loading environment variables from:', envPath)
dotenv.config({ path: envPath })

export class MCPService extends BaseMCPService {
  constructor() {
    const configPath = path.join(PROJECT_ROOT, 'mcp-config.json5')
    logger.debug('Config path:', configPath)
    super({
      logger,
      configPath
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
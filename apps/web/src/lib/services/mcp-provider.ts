import { createLogger } from '@danky/mcp'
import { MCPService } from './mcp-service'

const logger = createLogger({ level: 'info' })
let mcpService: MCPService | null = null

export async function getMCPService(): Promise<MCPService> {
  if (!mcpService) {
    logger.info('Creating new MCP service instance')
    mcpService = new MCPService()
    await mcpService.initialize()
  }
  return mcpService
}

export async function shutdownMCPService(): Promise<void> {
  if (mcpService) {
    logger.info('Shutting down MCP service')
    await mcpService.shutdown()
    mcpService = null
  }
} 
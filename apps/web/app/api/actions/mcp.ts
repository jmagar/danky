'use server'

import { z } from 'zod'
import { MCPService } from '@/lib/services/mcp-service'

// Singleton instance of MCPService
let mcpService: MCPService | null = null

// Initialize MCP service if not already initialized
async function ensureInitialized() {
  if (!mcpService) {
    mcpService = new MCPService({ logLevel: 'debug' })
    await mcpService.initialize()
  }
  return mcpService
}

// Schema for message processing
const messageSchema = z.object({
  message: z.string().min(1),
})

export async function processMessage(data: z.infer<typeof messageSchema>) {
  try {
    const validated = messageSchema.parse(data)
    const service = await ensureInitialized()
    return { success: true, response: await service.processMessage(validated.message) }
  } catch (error) {
    console.error('Error processing message:', error)
    return { success: false, error: 'Failed to process message' }
  }
}

export async function getServerStatus() {
  try {
    const service = await ensureInitialized()
    return { success: true, status: service.getServerStatus() }
  } catch (error) {
    console.error('Error getting server status:', error)
    return { success: false, error: 'Failed to get server status' }
  }
}

export async function getAvailableTools() {
  try {
    const service = await ensureInitialized()
    return { success: true, tools: service.getAvailableTools() }
  } catch (error) {
    console.error('Error getting available tools:', error)
    return { success: false, error: 'Failed to get available tools' }
  }
}

export async function shutdownMCP() {
  try {
    if (mcpService) {
      await mcpService.shutdown()
      mcpService = null
      return { success: true }
    }
    return { success: true, message: 'Service not running' }
  } catch (error) {
    console.error('Error shutting down MCP:', error)
    return { success: false, error: 'Failed to shutdown MCP' }
  }
} 
'use server'

import { MCPService } from '@danky/mcp'

let mcpService: MCPService | null = null

async function getMCPService() {
  if (!mcpService) {
    mcpService = new MCPService()
    await mcpService.initialize()
  }
  return mcpService
}

export async function initialize() {
  try {
    const service = await getMCPService()
    return { success: true }
  } catch (error) {
    console.error('Failed to initialize MCP service:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function getStatus() {
  try {
    const service = await getMCPService()
    return { success: true, status: { isInitialized: true } }
  } catch (error) {
    console.error('Failed to get MCP service status:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function getTools() {
  try {
    const service = await getMCPService()
    return { success: true, tools: [] }
  } catch (error) {
    console.error('Failed to get MCP tools:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function processMessage(message: string) {
  try {
    const service = await getMCPService()
    const response = await service.processMessage(message)
    return { success: true, response }
  } catch (error) {
    console.error('Failed to process message:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function shutdown() {
  try {
    if (mcpService) {
      await mcpService.shutdown()
      mcpService = null
    }
    return { success: true }
  } catch (error) {
    console.error('Failed to shutdown MCP service:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
} 
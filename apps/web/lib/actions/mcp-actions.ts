'use server'

import { getMCPService, shutdownMCPService } from '../services/mcp-provider'

type ServerStatus = 'connected' | 'disconnected' | 'error'

interface Tool {
  serverId: string
  toolId: string
  name: string
  description: string
}

interface InitializeResult {
  isInitialized: boolean
  serverStatus: Record<string, ServerStatus>
  availableTools: Tool[]
  error: string | null
}

export async function initialize(): Promise<InitializeResult> {
  try {
    const _service = await getMCPService()
    return {
      isInitialized: true,
      serverStatus: {
        mcp: 'connected'
      },
      availableTools: [],
      error: null
    }
  } catch (error) {
    console.error('Failed to initialize MCP service:', error)
    return {
      isInitialized: false,
      serverStatus: {},
      availableTools: [],
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export async function processMessage(message: string) {
  try {
    const _service = await getMCPService()
    return await _service.processMessage(message)
  } catch (error) {
    console.error('Failed to process message:', error)
    throw error
  }
}

export async function shutdown() {
  try {
    await shutdownMCPService()
  } catch (error) {
    console.error('Failed to shutdown MCP service:', error)
    throw error
  }
} 
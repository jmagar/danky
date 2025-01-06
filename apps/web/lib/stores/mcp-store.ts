import { create } from 'zustand'
import { type StateCreator, type StoreApi } from 'zustand'
import { MCPService } from '../services/mcp-service'

interface ServerStatus {
  status: 'connected' | 'disconnected' | 'error'
  error?: string
}

interface Tool {
  serverId: string
  toolId: string
  name: string
  description: string
}

interface MCPState {
  service: MCPService | null
  isInitialized: boolean
  isInitializing: boolean
  serverStatus: Record<string, ServerStatus>
  availableTools: Tool[]
  error: string | null
  initialize: (configPath?: string) => Promise<void>
  shutdown: () => Promise<void>
  processMessage: (message: string) => Promise<string>
}

type MCPStore = StateCreator<
  MCPState,
  [],
  [],
  MCPState
>

type SetState = StoreApi<MCPState>['setState']
type GetState = StoreApi<MCPState>['getState']

const createMCPStore: MCPStore = (set: SetState, get: GetState) => ({
  service: null,
  isInitialized: false,
  isInitializing: false,
  serverStatus: {},
  availableTools: [],
  error: null,

  initialize: async (configPath?: string) => {
    if (get().isInitializing || get().isInitialized) return

    set({ isInitializing: true, error: null })
    
    try {
      const service = new MCPService({ logLevel: 'info' })
      await service.initialize(configPath)
      
      const serverStatus = Object.entries(service.getServerStatus()).reduce(
        (acc, [serverId, status]) => {
          acc[serverId] = { status }
          return acc
        },
        {} as Record<string, ServerStatus>
      )

      set({
        service,
        isInitialized: true,
        isInitializing: false,
        serverStatus,
        availableTools: service.getAvailableTools(),
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize MCP',
        isInitializing: false,
      })
    }
  },

  shutdown: async () => {
    const { service } = get()
    if (!service) return

    try {
      await service.shutdown()
      set({
        service: null,
        isInitialized: false,
        serverStatus: {},
        availableTools: [],
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to shutdown MCP',
      })
    }
  },

  processMessage: async (message: string) => {
    const { service, isInitialized } = get()
    if (!service || !isInitialized) {
      throw new Error('MCP service not initialized')
    }

    try {
      return await service.processMessage(message)
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to process message',
      })
      throw error
    }
  },
})

export const useMCPStore = create<MCPState>()(createMCPStore) 
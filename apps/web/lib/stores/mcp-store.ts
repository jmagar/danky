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
  initialize: () => Promise<void>
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

  initialize: async () => {
    if (get().isInitializing || get().isInitialized) return

    set({ isInitializing: true, error: null })
    
    try {
      // First validate that we have the required API key
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY environment variable is not set')
      }

      const service = new MCPService({ logLevel: 'debug' })
      
      try {
        await service.initialize()
      } catch (initError) {
        // If server initialization fails but the service is still usable
        // (i.e., the LLM is initialized), we'll continue with degraded functionality
        console.warn('Some MCP servers failed to initialize:', initError)
        set({
          error: initError instanceof Error ? initError.message : 'Some MCP servers failed to initialize',
        })
      }
      
      // Even if some servers fail, we can still use the service if it's partially initialized
      if (!service.isPartiallyInitialized()) {
        throw new Error('MCP Service failed to initialize any components')
      }
      
      const serverStatus = Object.entries(service.getServerStatus()).reduce(
        (acc, [serverId, status]) => {
          acc[serverId] = { 
            status,
            error: status === 'error' ? 'Failed to initialize server' : undefined
          }
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
      const errorMessage = error instanceof Error 
        ? `Failed to initialize MCP: ${error.message}`
        : 'Failed to initialize MCP'
      
      set({
        error: errorMessage,
        isInitializing: false,
        service: null,
        isInitialized: false,
        serverStatus: {},
      })
      
      throw new Error(errorMessage)
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
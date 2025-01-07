import { create } from 'zustand'
import { MCPService } from '../services/mcp-service'

type ServerStatus = 'connected' | 'disconnected' | 'error'

interface MCPState {
  isInitialized: boolean
  isInitializing: boolean
  serverStatus: Record<string, ServerStatus>
  availableTools: Array<{ serverId: string; toolId: string; name: string; description: string }>
  error: string | null
}

interface MCPActions {
  initialize: () => Promise<void>
  processMessage: (message: string) => Promise<string>
  reset: () => void
}

const initialState: MCPState = {
  isInitialized: false,
  isInitializing: false,
  serverStatus: {},
  availableTools: [],
  error: null,
}

// Create service instance outside of store to maintain singleton
const mcpService = new MCPService()

export const useMCPStore = create<MCPState & MCPActions>((set, get) => ({
  ...initialState,

  initialize: async () => {
    if (get().isInitialized || get().isInitializing) return

    set({ isInitializing: true })

    try {
      await mcpService.initialize()
      
      set({
        isInitialized: true,
        serverStatus: mcpService.getServerStatus(),
        availableTools: mcpService.getAvailableTools().map(tool => {
          const [serverId, toolId] = tool.name.split('_')
          return {
            serverId,
            toolId,
            name: tool.name,
            description: tool.description
          }
        })
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to initialize MCP service',
        serverStatus: {},
        availableTools: []
      })
    } finally {
      set({ isInitializing: false })
    }
  },

  processMessage: async (message: string) => {
    if (!get().isInitialized) {
      throw new Error('MCP service not initialized')
    }

    try {
      return await mcpService.processMessage(message)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process message'
      set({ error: errorMessage })
      throw new Error(errorMessage)
    }
  },

  reset: () => {
    mcpService.shutdown().catch(console.error)
    set(initialState)
  }
})) 
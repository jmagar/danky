'use client';

import { create } from 'zustand';
import * as mcpActions from '../actions/mcp-actions';

type ServerStatus = 'connected' | 'disconnected' | 'error';

interface Tool {
  serverId: string;
  toolId: string;
  name: string;
  description: string;
}

interface MCPState {
  isInitialized: boolean;
  isInitializing: boolean;
  serverStatus: Record<string, ServerStatus>;
  availableTools: Tool[];
  error: string | null;
}

interface MCPActions {
  initialize: () => Promise<void>;
  processMessage: (message: string) => Promise<string>;
  reset: () => void;
}

type MCPStore = MCPState & MCPActions;

const initialState: MCPState = {
  isInitialized: false,
  isInitializing: false,
  serverStatus: {},
  availableTools: [],
  error: null,
};

export const useMCPStore = create<MCPStore>((set, get) => ({
  ...initialState,

  initialize: async () => {
    if (get().isInitialized || get().isInitializing) return;

    set({ isInitializing: true });

    try {
      const result = await mcpActions.initialize();

      set({
        isInitialized: result.isInitialized,
        serverStatus: result.serverStatus,
        availableTools: result.availableTools,
        error: result.error,
      });
    } catch (error) {
      set({
        isInitialized: false,
        error: error instanceof Error ? error.message : 'Failed to initialize MCP service',
        serverStatus: {},
        availableTools: [],
      });
    } finally {
      set({ isInitializing: false });
    }
  },

  processMessage: async (message: string) => {
    if (!get().isInitialized) {
      throw new Error('MCP service not initialized');
    }

    try {
      return await mcpActions.processMessage(message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process message';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  reset: () => {
    mcpActions.shutdown().catch(console.error);
    set(initialState);
  },
}));

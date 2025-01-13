'use server';

import { convertMcpToLangchainTools } from '@h1deya/langchain-mcp-tools';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { initializeAgentExecutorWithOptions, AgentExecutor } from 'langchain/agents';

type ServerStatus = 'connected' | 'disconnected' | 'error';

interface Tool {
  serverId: string;
  toolId: string;
  name: string;
  description: string;
}

interface InitializeResult {
  isInitialized: boolean;
  serverStatus: Record<string, ServerStatus>;
  availableTools: Tool[];
  error: string | null;
}

let agent: AgentExecutor | null = null;
let cleanup: (() => Promise<void>) | null = null;

export async function initialize(): Promise<InitializeResult> {
  try {
    const model = new ChatOpenAI({
      modelName: 'gpt-4-turbo-preview',
      temperature: 0,
    });

    const { tools, cleanup: cleanupFn } = await convertMcpToLangchainTools({
      mcp: {
        command: 'node',
        args: ['server.js'],
        env: {
          MCP_SERVER_URL: process.env.MCP_SERVER_URL || 'http://localhost:3001',
        },
      },
    });

    cleanup = cleanupFn;
    agent = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: 'chat-conversational-react-description',
      verbose: true,
    });

    return {
      isInitialized: true,
      serverStatus: {
        mcp: 'connected',
      },
      availableTools: tools.map((tool: DynamicStructuredTool) => ({
        serverId: 'mcp',
        toolId: tool.name,
        name: tool.name,
        description: tool.description,
      })),
      error: null,
    };
  } catch (error) {
    console.error('Failed to initialize MCP service:', error);
    return {
      isInitialized: false,
      serverStatus: {},
      availableTools: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function processMessage(message: string) {
  if (!agent) {
    throw new Error('Agent not initialized');
  }

  try {
    const result = await agent.call({ input: message });
    return result.output;
  } catch (error) {
    console.error('Failed to process message:', error);
    throw error;
  }
}

export async function shutdown() {
  if (cleanup) {
    await cleanup();
    cleanup = null;
  }
  agent = null;
}

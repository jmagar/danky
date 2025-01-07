import { z } from 'zod'

const LLMConfigSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'groq']),
  model: z.string(),
  apiKey: z.string(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
})

const MCPServerConfigSchema = z.object({
  command: z.string(),
  args: z.array(z.string()),
  env: z.record(z.string()).optional(),
})

const MCPConfigSchema = z.object({
  llm: LLMConfigSchema,
  mcpServers: z.record(MCPServerConfigSchema),
})

export type MCPConfig = z.infer<typeof MCPConfigSchema>

export function loadMCPConfig(): MCPConfig {
  // In a real app, this would load from environment variables or a config file
  const config = {
    llm: {
      provider: process.env.NEXT_PUBLIC_LLM_PROVIDER || 'openai',
      model: process.env.NEXT_PUBLIC_LLM_MODEL || 'gpt-4-turbo-preview',
      apiKey: process.env.LLM_API_KEY || '',
      temperature: 0.7,
      maxTokens: 1000,
    },
    mcpServers: {
      'brave-search': {
        command: 'npx',
        args: ['@modelcontextprotocol/server-brave-search'],
        env: {
          BRAVE_SEARCH_API_KEY: process.env.BRAVE_SEARCH_API_KEY || '',
        },
      },
      'weather': {
        command: 'npx',
        args: ['@modelcontextprotocol/server-weather'],
        env: {
          WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
        },
      },
      'filesystem': {
        command: 'npx',
        args: ['@modelcontextprotocol/server-filesystem'],
      },
    },
  }

  return MCPConfigSchema.parse(config)
} 
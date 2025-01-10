import { z } from 'zod'
import JSON5 from 'json5'
import { readFileSync } from 'fs'
import path from 'path'

const LLMConfigSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'groq']),
  model: z.string(),
  apiKey: z.string().optional(),
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
  try {
    // Load the config file
    const configPath = path.resolve(process.cwd(), 'mcp-config.json5')
    let configStr = readFileSync(configPath, 'utf-8')

    // Replace environment variables in the format ${VAR_NAME} with their values
    Object.entries(process.env).forEach(([key, value]) => {
      const regex = new RegExp(`\\$\{${key}\}`, 'g')
      if (value) {
        configStr = configStr.replace(regex, value)
      }
    })

    // Parse the config
    const config = JSON5.parse(configStr)

    // Validate required environment variables are set
    if (config.llm?.apiKey?.includes('${')) {
      const missing = config.llm.apiKey.match(/\$\{([^}]+)\}/g)?.map((match: string) => match.slice(2, -1))
      throw new Error(`Environment variables not found: ${missing?.join(', ')}. Make sure these are set in the root .env file, not .env.local`)
    }

    // Update filesystem server path to be relative to the config location
    if (config.mcpServers?.filesystem?.args) {
      const args = config.mcpServers.filesystem.args
      const dirIndex = args.findIndex((arg: string) => arg === '.')
      if (dirIndex !== -1) {
        const newPath = path.dirname(configPath)
        console.log(`Updating filesystem server path from '.' to:`, newPath)
        args[dirIndex] = newPath
      }
    }

    return MCPConfigSchema.parse(config)
  } catch (error) {
    console.error('Failed to load MCP configuration:', error)
    throw error
  }
} 
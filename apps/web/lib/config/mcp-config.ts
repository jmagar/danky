import { readFileSync } from 'fs'
import JSON5 from 'json5'
import path from 'path'
import dotenv from 'dotenv'
import { type Config } from '@danky/mcp/load-config'

// Load environment variables from root .env file
const rootEnvPath = path.join(process.cwd(), '..', '..', '.env')
dotenv.config({ path: rootEnvPath })

export function loadMCPConfig(): Config {
  console.log('Current working directory:', process.cwd())
  console.log('Current environment:', {
    NODE_ENV: process.env.NODE_ENV,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? '(set)' : '(not set)'
  })

  // Try different possible locations for the config file
  const projectRoot = path.join(process.cwd(), '..', '..')
  const possiblePaths = [
    // Project root
    path.join(projectRoot, 'mcp-config.json5'),
    // Current directory
    path.join(process.cwd(), 'mcp-config.json5'),
    // Up one level (from apps/web)
    path.join(process.cwd(), '..', 'mcp-config.json5'),
    // Absolute path if we know it
    '/home/jmagar/code/danky/mcp-config.json5',
  ]

  console.log('Searching for config file in:', possiblePaths)

  let configStr: string | null = null
  let loadedPath: string | null = null

  // Try each path until we find the config
  for (const configPath of possiblePaths) {
    try {
      configStr = readFileSync(configPath, 'utf-8')
      loadedPath = configPath
      console.log('Successfully loaded MCP config from:', configPath)
      break
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.log(`Could not load config from ${configPath}:`, errorMessage)
      continue
    }
  }

  if (!configStr || !loadedPath) {
    throw new Error(`Could not find mcp-config.json5 in any of these locations: ${possiblePaths.join(', ')}`)
  }

  console.log('Raw config before variable substitution:', configStr)

  // Replace environment variables in the config
  Object.entries(process.env).forEach(([key, value]) => {
    if (value && configStr) {
      const regex = new RegExp(`\\$\{${key}\}`, 'g')
      const oldStr = configStr
      configStr = configStr.replace(regex, value)
      if (oldStr !== configStr) {
        console.log(`Replaced \${${key}} in config with value from process.env`)
      }
    }
  })

  console.log('Config after variable substitution:', configStr)

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
      const newPath = path.dirname(loadedPath)
      console.log(`Updating filesystem server path from '.' to:`, newPath)
      args[dirIndex] = newPath
    }
  }

  return config
} 
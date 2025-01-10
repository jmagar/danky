import { readFileSync } from 'fs'
import JSON5 from 'json5'
import path from 'path'
import dotenv from 'dotenv'
import { type Config, loadConfig as loadBaseConfig } from '@danky/mcp/load-config'

// Load environment variables from root .env file
const rootEnvPath = path.resolve(__dirname, '../../../../.env')
dotenv.config({ path: rootEnvPath })

export function loadMCPConfig(): Config {
  console.log('Current working directory:', process.cwd())
  console.log('Current environment:', {
    NODE_ENV: process.env.NODE_ENV,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? '(set)' : '(not set)'
  })

  // Try different possible locations for the config file
  const projectRoot = path.resolve(__dirname, '../../../../')
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

  let loadedPath: string | null = null

  // Try each path until we find the config
  for (const configPath of possiblePaths) {
    try {
      const config = loadBaseConfig(configPath)
      loadedPath = configPath
      console.log('Successfully loaded MCP config from:', configPath)

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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.log(`Could not load config from ${configPath}:`, errorMessage)
      continue
    }
  }

  throw new Error(`Could not find mcp-config.json5 in any of these locations: ${possiblePaths.join(', ')}`)
} 
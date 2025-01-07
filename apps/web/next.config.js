/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@langchain/langgraph',
    '@langchain/core',
    '@langchain/anthropic',
    '@langchain/openai',
    '@langchain/groq',
    '@modelcontextprotocol/sdk',
    '@h1deya/mcp-langchain-tools',
    'json5',
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to import these packages on the client side
      config.resolve.fallback = {
        fs: false,
        path: false,
        async_hooks: false,
        child_process: false,
        net: false,
        tls: false,
        process: false,
      }
      // Handle node: protocol imports
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:async_hooks': false,
        'node:child_process': false,
        'node:net': false,
        'node:tls': false,
        'node:process': false,
        'node:fs': false,
        'node:path': false,
      }
    }
    return config
  },
  // Load environment variables from root .env
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  },
}

module.exports = nextConfig

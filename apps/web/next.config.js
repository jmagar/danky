/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@langchain/langgraph',
    '@langchain/core',
    '@langchain/anthropic',
    '@langchain/openai',
    '@langchain/groq',
    '@modelcontextprotocol/sdk',
    'json5',
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to import these packages on the client side
      config.resolve.fallback = {
        fs: false,
        path: false,
        async_hooks: false,
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

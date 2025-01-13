/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@danky/ui', '@danky/mcp'],
  experimental: {
    esmExternals: true,
  },
  serverExternalPackages: ['shiki'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        async_hooks: false,
        child_process: false,
        net: false,
        tls: false,
        process: false,
      };
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
      };
    }

    // Add module resolution aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@n8n/json-schema-to-zod': '@n8n/json-schema-to-zod',
    };

    // Add extension resolution
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };

    return config;
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src/app', 'src/components', 'src/lib', 'src/hooks'],
  },
};

export default nextConfig;

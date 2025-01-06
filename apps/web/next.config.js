/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@danky/ui", "@danky/mcp"],
  experimental: {
    esmExternals: true
  }
}

#!/bin/bash

# Clean all builds
pnpm clean

# Build packages in dependency order
echo "Building packages..."

# Build base packages first
pnpm --filter @danky/logger build
pnpm --filter @danky/schema build

# Build dependent packages
pnpm --filter @danky/redis build
pnpm --filter @danky/db build
pnpm --filter @danky/qdrant build
pnpm --filter @danky/ui build

# Build MCP last as it depends on multiple packages
pnpm --filter @danky/mcp build

echo "Build complete!"

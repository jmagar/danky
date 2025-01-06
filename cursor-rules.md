# Cursor Rules for Package Management

## PNPM Rules

1. **Install from Root**
   - Always install packages from the workspace root
   - Use `-D -w` flags for root dev dependencies (order matters)
   - Example: `pnpm add -D -w package-name`
   - Use `--frozen-lockfile` in CI environments (on by default)

2. **Workspace Dependencies**
   - Use `workspace:*` for internal package dependencies
   - Example: `"@danky/ui": "workspace:*"`
   - Use `--filter` for targeting specific packages
   - Example: `pnpm add -D package-name --filter @danky/ui`

3. **Package Installation**
   - Never install packages directly in `packages/*` directories
   - Use root installation with workspace filters if needed
   - Use `--no-frozen-lockfile` only when updating dependencies intentionally
   - Example: `pnpm install --no-frozen-lockfile`

4. **Peer Dependencies**
   - List all peer dependencies in package.json
   - Use `peerDependencies` field for framework dependencies
   - Use `auto-install-peers=true` in .npmrc
   - Example: React, Next.js, etc.

5. **Development Dependencies**
   - Install dev dependencies at root when possible
   - Use workspace filters for package-specific dev deps
   - Always use `-D` flag before `-w` for dev dependencies
   - Example: TypeScript configs, ESLint configs

6. **Version Management**
   - Keep consistent versions across packages
   - Use workspace protocol for internal dependencies
   - Use exact versions or appropriate semver ranges
   - Example: All packages use same TypeScript version

7. **Scripts**
   - Define common scripts in root package.json
   - Use workspace-specific scripts when needed
   - Use `-r` flag for recursive script execution
   - Use consistent naming across packages:
     - `type-check` for TypeScript checks (not `check-types`)
     - `lint` for ESLint checks
     - `format` for Prettier formatting
     - `dev` for development server
     - `build` for production builds
   - Example: `pnpm -r type-check` runs for all packages

8. **Configuration**
   - Keep global configs at root level
   - Use package-specific configs when needed
   - Use .npmrc for pnpm settings
   - Example: `.npmrc`, `tsconfig.json`

9. **Hoisting**
   - Use selective hoisting for dev tools
   - Keep production dependencies in their packages
   - Configure via public-hoist-pattern in .npmrc
   - Example: ESLint and Prettier are hoisted

10. **Security**
    - Prevent accidental package.json modifications
    - Prevent accidental publishing
    - Use proper workspace protocols
    - Use `--frozen-lockfile` in CI environments 
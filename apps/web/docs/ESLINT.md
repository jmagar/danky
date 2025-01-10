# ESLint Configuration

This project uses ESLint 9 with the new flat config system for code quality and consistency.

## Setup

The ESLint configuration is defined in `eslint.config.js` and uses the following key features:

- TypeScript support with strict type checking
- React and React Hooks rules
- Next.js specific rules
- Import organization and sorting
- Path alias resolution

## Key Rules

### TypeScript
- Enforces consistent type imports
- Prevents floating promises
- Disallows explicit `any`
- Warns about unused variables
- Enforces proper type inference

### React
- Enforces key prop usage
- Prevents undefined JSX elements
- Warns about unused prop types
- Enforces proper hooks usage

### Import Organization
- Prevents circular dependencies
- Enforces import sorting
- Groups imports by type
- Maintains consistent spacing

## Scripts

```bash
# Run ESLint
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix

# Type check
pnpm type-check
```

## VSCode Integration

Install the ESLint extension and use the following workspace settings:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "eslint.enable": true,
  "eslint.format.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Path Aliases

The configuration supports the following path aliases:
- `@/*` - Points to src directory
- `@/lib/*` - Points to lib directory
- `@/components/*` - Points to components directory
- `@/app/*` - Points to app directory
- `@/hooks/*` - Points to hooks directory
- `@danky/ui` - Points to UI package
- `@danky/mcp` - Points to MCP package

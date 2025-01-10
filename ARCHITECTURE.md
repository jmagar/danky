# Danky AI Chatbot - Architecture Guide

## Project Structure

```
danky/
├── apps/
│   └── web/              # Next.js web application
│       ├── src/
│       │   ├── app/      # Next.js App Router pages
│       │   ├── components/
│       │   │   ├── chat/     # Chat-specific components
│       │   │   ├── mcp/      # MCP (Model Context Protocol) components
│       │   │   ├── sidebar/  # Navigation and layout components
│       │   │   └── theme/    # Theme-related components
│       │   ├── hooks/    # React hooks
│       │   └── lib/      # Shared utilities
│       │       ├── actions/   # Server actions
│       │       ├── config/    # App configuration
│       │       ├── db/        # Database utilities
│       │       ├── services/  # Service layer
│       │       ├── stores/    # Client-side state
│       │       └── validations/ # Schema validations
│       └── docs/         # Component and feature documentation
├── packages/
│   ├── ui/              # Shared UI components (shadcn/ui)
│   ├── mcp/             # Model Context Protocol implementation
│   ├── db/              # Database schema and utilities
│   ├── schema/          # Shared type definitions and validations
│   ├── logger/          # Structured logging utilities
│   ├── eslint-config/   # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
└── docs/                # Project-wide documentation
```

## Package Responsibilities

### Core Packages
- **@danky/ui**: Reusable UI components built with shadcn/ui
- **@danky/mcp**: Model Context Protocol for AI interactions
- **@danky/db**: Database schema, migrations, and type definitions
- **@danky/schema**: Shared type definitions and Zod schemas
- **@danky/logger**: Structured logging with Pino

### Infrastructure Packages
- **@danky/eslint-config**: Shared ESLint rules
- **@danky/typescript-config**: Base TypeScript configurations

## Key Concepts

### Component Organization
- **Feature-based Structure**: Components are organized by feature (chat, mcp, etc.)
- **Shared vs App-specific**: Common components live in `packages/ui`, app-specific in `apps/web/src/components`
- **Server vs Client**: Server components are default, marked with 'use client' when needed

### State Management
- **Server State**: Handled through Server Components and Server Actions
- **Client State**: Managed with Zustand stores in `lib/stores`
- **Form State**: Uses react-hook-form with zod validation

### Styling
- **Tailwind CSS**: Primary styling solution
- **CSS Variables**: Theme values in `globals.css`
- **shadcn/ui**: Component library with consistent styling
- **CSS Modules**: Used for component-specific styles when needed

### Type Safety
- **TypeScript**: Strict mode enabled
- **Zod**: Runtime type validation
- **Path Aliases**: Configured for clean imports

## Development Guidelines

### Adding New Features
1. Determine if the feature belongs in `packages/` or `apps/`
2. Create a new directory under appropriate location
3. Add documentation in the feature's directory
4. Update this guide if architecture changes

### Component Guidelines
- Keep components under 200 lines
- Split large components into smaller ones
- Use composition over inheritance
- Document complex components with comments
- Add `.md` files for component documentation

### File Naming Conventions
- React components: `component-name.tsx`
- Utilities: `utility-name.ts`
- Types: `types.ts` in feature directories
- Constants: `constants.ts`
- Hooks: `use-feature-name.ts`

### Import Organization
```typescript
// External imports
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// Internal package imports
import { Button } from '@danky/ui'
import { type Tool } from '@danky/mcp'

// Local imports
import { useChat } from '@/hooks/use-chat'
import { cn } from '@/lib/utils'
```

## AI Assistant Guidelines

### Key Files for Context
- `apps/web/src/app/layout.tsx` - Root layout and providers
- `apps/web/src/components/chat/types.ts` - Chat-related types
- `packages/mcp/src/types.ts` - MCP core types
- `apps/web/src/lib/stores/chat-store.ts` - Chat state management

### Common Operations
- Adding UI components: `pnpm ui:add [component-name]`
- Linting: `pnpm lint`
- Type checking: `pnpm type-check`

### Feature Locations
- Chat functionality: `apps/web/src/components/chat`
- MCP tools: `apps/web/src/components/mcp`
- UI components: `packages/ui/src/components`
- Server actions: `apps/web/src/lib/actions`

### Configuration Files
- ESLint: `apps/web/eslint.config.js`
- TypeScript: `apps/web/tsconfig.json`
- Tailwind: `apps/web/tailwind.config.js`
- Next.js: `apps/web/next.config.js`

## Best Practices

### Performance
- Use React Suspense boundaries
- Implement proper loading states
- Optimize images and assets
- Use proper caching strategies

### Accessibility
- Follow ARIA best practices
- Use semantic HTML
- Ensure keyboard navigation
- Maintain proper contrast ratios

### Security
- Validate all inputs
- Use proper auth checks
- Handle errors gracefully
- Sanitize user content

### Testing
- Write unit tests for utilities
- Add component tests for complex features
- Use proper mocking strategies
- Test error scenarios

## Troubleshooting

### Common Issues
1. **Type Errors**: Check `tsconfig.json` and path aliases
2. **Build Errors**: Verify package versions in `package.json`
3. **Style Issues**: Check Tailwind classes and CSS modules
4. **State Issues**: Verify store implementations

### Debug Tools
- React DevTools
- Next.js DevTools
- Chrome DevTools
- VSCode Debugger

## Contributing

1. Follow the file organization
2. Add proper documentation
3. Use conventional commits
4. Update relevant docs
5. Add tests for new features

## AI Development Guidelines

### Type Resolution
When working with types, check these locations in order:
1. Local `types.ts` in feature directory
2. `@danky/schema` package for shared types
3. `@danky/db` for database types
4. `@danky/mcp` for AI interaction types

### Component Resolution
When adding/modifying components:
1. Check `packages/ui` for existing components
2. Use `pnpm ui:add` for new shadcn/ui components
3. Create in feature directory if specific to one feature
4. Create in `packages/ui` if shared across features

### Database Operations
All database operations should:
1. Use types from `@danky/db`
2. Validate input with `@danky/schema`
3. Include proper error handling
4. Log operations with `@danky/logger`

### AI Integration Points
Key areas for AI functionality:
1. `packages/mcp/src/tools/` - Tool implementations
2. `apps/web/src/components/chat/` - Chat interface
3. `apps/web/src/lib/actions/` - Server actions
4. `packages/schema/src/ai/` - AI-related types

## Code Organization

### Feature Structure
A typical feature should follow this structure:
```
feature/
├── components/     # UI components
│   ├── index.ts   # Public exports
│   └── types.ts   # Component types
├── hooks/         # Feature-specific hooks
├── utils/         # Helper functions
├── constants.ts   # Feature constants
├── types.ts       # Feature-wide types
└── README.md      # Feature documentation
```

### Component Structure
Components should follow this pattern:
```typescript
// Type imports
import type { ComponentProps } from '@/types'
import type { Tool } from '@danky/mcp'

// External imports
import { useState } from 'react'

// Internal package imports
import { Button } from '@danky/ui'

// Local imports
import { useFeature } from '../hooks/use-feature'

// Component definition
export function FeatureComponent({ prop }: ComponentProps) {
  // Implementation
}
```

## Common Patterns

### Error Handling
```typescript
import { logger } from '@danky/logger'
import { DatabaseError } from '@danky/db'

try {
  // Operation
} catch (error) {
  if (error instanceof DatabaseError) {
    logger.error({ error }, 'Database operation failed')
    // Handle database error
  }
  // Re-throw unknown errors
  throw error
}
```

### Data Validation
```typescript
import { userSchema } from '@danky/schema'
import { logger } from '@danky/logger'

export async function createUser(data: unknown) {
  const parsed = userSchema.parse(data)
  logger.info({ userId: parsed.id }, 'Creating user')
  // Proceed with validated data
}
```

### State Management
```typescript
import { create } from 'zustand'
import type { FeatureState } from '@danky/schema'

export const useFeatureStore = create<FeatureState>((set) => ({
  // State implementation
}))
```

## AI Assistance Notes

### Key Type Locations
- Database types: `packages/db/src/types.ts`
- Schema types: `packages/schema/src/types.ts`
- MCP types: `packages/mcp/src/types.ts`
- Component types: `packages/ui/src/types.ts`

### Common Operations
- Adding UI components: `pnpm ui:add [component-name]`
- Database migrations: `pnpm db:migrate`
- Type checking: `pnpm type-check`
- Linting: `pnpm lint`

### Important Context Files
- `apps/web/src/app/layout.tsx` - Root layout
- `packages/mcp/src/config.ts` - MCP configuration
- `packages/db/src/schema.ts` - Database schema
- `packages/schema/src/index.ts` - Shared types

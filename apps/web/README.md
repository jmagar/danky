# Danky Web Application

The main web interface for the Danky AI Chatbot platform, built with Next.js 14, React Server Components, and shadcn/ui.

## Directory Structure

```
src/
├── app/                # Next.js App Router pages
│   ├── api/           # API routes
│   ├── chat/          # Chat interface pages
│   └── layout.tsx     # Root layout
├── components/        # React components
│   ├── chat/         # Chat-specific components
│   ├── mcp/          # MCP integration components
│   ├── sidebar/      # Navigation components
│   ├── theme/        # Theme components
│   └── ui/           # App-specific UI components
├── hooks/            # React hooks
├── lib/              # Utilities and services
│   ├── actions/      # Server actions
│   ├── config/       # App configuration
│   ├── db/           # Database utilities
│   ├── services/     # Service layer
│   ├── stores/       # Client-side state
│   └── validations/  # Schema validations
└── types/            # TypeScript types
```

## Key Features

- **Chat Interface**: Real-time AI chat with multiple model support
- **MCP Integration**: Model Context Protocol for AI interactions
- **Theme Support**: Dark/light mode with customizable themes
- **Server Components**: Optimized for performance with RSC
- **Type Safety**: Full TypeScript coverage with strict mode

## Development

### Prerequisites

- Node.js 20.11.0+
- pnpm 8.x+
- PostgreSQL 15+

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start development server:
```bash
pnpm dev
```

### AI Development Notes

#### Key Files for Context
- `src/app/layout.tsx` - Root layout and providers
- `src/components/chat/types.ts` - Chat-related types
- `src/lib/stores/chat-store.ts` - Chat state management

#### Common Operations
- Add UI component: `pnpm ui:add [component-name]`
- Run type check: `pnpm type-check`
- Run linter: `pnpm lint`
- Run tests: `pnpm test`

#### Component Guidelines
- Use Server Components by default
- Add 'use client' only when needed
- Keep components under 200 lines
- Follow the feature-based structure

#### State Management
- Server state: Server Components
- Form state: react-hook-form + zod
- Client state: Zustand stores
- Global state: React Context

## Configuration

### ESLint
- Uses flat config format (eslint.config.js)
- Extends from @danky/eslint-config
- Strict TypeScript rules enabled

### TypeScript
- Strict mode enabled
- Path aliases configured
- Server/client separation

### Tailwind CSS
- Extended theme in tailwind.config.js
- shadcn/ui components support
- Custom color schemes

## Testing

### Unit Tests
```bash
pnpm test:unit
```

### Integration Tests
```bash
pnpm test:integration
```

### E2E Tests
```bash
pnpm test:e2e
```

## Deployment

### Production Build
```bash
pnpm build
```

### Environment Variables
Required:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Auth secret key
- `NEXTAUTH_URL`: Auth callback URL

Optional:
- `SENTRY_DSN`: Error tracking
- `VERCEL_URL`: Vercel deployment URL

## Troubleshooting

### Common Issues
1. **Type Errors**: Check path aliases in tsconfig.json
2. **Build Errors**: Verify package versions
3. **Style Issues**: Check Tailwind classes
4. **State Issues**: Verify store implementations

### Debug Tools
- React DevTools
- Next.js DevTools
- Chrome DevTools
- VSCode Debugger

## Additional Resources

- [Architecture Guide](../../docs/ARCHITECTURE.md)
- [Component Patterns](../../docs/PATTERNS.md)
- [API Documentation](../../docs/API.md)
- [Testing Guide](../../docs/TESTING.md)

# @danky/schema

Shared type definitions and validation schemas for the Danky AI Chatbot platform, built with Zod.

## Overview

The schema package provides centralized type definitions, validation schemas, and utilities for ensuring type safety and data validation across the platform. It uses Zod for runtime type checking and validation.

## Directory Structure

```
src/
├── ai/              # AI-related schemas
├── chat/            # Chat-related schemas
├── db/              # Database schemas
├── api/             # API schemas
├── config/          # Configuration schemas
└── types/           # Shared TypeScript types
```

## Key Features

- **Type Safety**: Full TypeScript coverage
- **Runtime Validation**: Zod schemas
- **Error Messages**: Customizable validation errors
- **Composability**: Reusable schema components
- **Documentation**: Type and schema docs
- **Testing**: Validation test utilities

## Usage

### Basic Validation

```typescript
import { userSchema } from '@danky/schema'

// Validate data
const result = userSchema.safeParse(data)
if (!result.success) {
  console.error(result.error.format())
  return
}

// Use validated data
const user = result.data
```

### Type Usage

```typescript
import type { User, Message } from '@danky/schema'

function processUser(user: User) {
  // TypeScript knows the shape of User
}

function processMessage(message: Message) {
  // TypeScript knows the shape of Message
}
```

## AI Development Notes

### Key Concepts

1. **Schema Organization**
   - Domain-specific schemas
   - Shared base schemas
   - Type exports
   - Error messages

2. **Validation Patterns**
   - Input validation
   - API responses
   - Database records
   - Configuration

3. **Type System**
   - Branded types
   - Union types
   - Utility types
   - Type inference

### Common Patterns

#### Schema Definition
```typescript
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
  metadata: z.record(z.unknown()).optional(),
})

export type User = z.infer<typeof userSchema>
```

#### Branded Types
```typescript
import { z } from 'zod'

export const UserId = z.string().uuid().brand('UserId')
export type UserId = z.infer<typeof UserId>

export const MessageId = z.string().uuid().brand('MessageId')
export type MessageId = z.infer<typeof MessageId>
```

#### API Schemas
```typescript
import { z } from 'zod'

export const createUserRequest = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export const createUserResponse = z.object({
  user: userSchema,
  token: z.string(),
})

export type CreateUserRequest = z.infer<typeof createUserRequest>
export type CreateUserResponse = z.infer<typeof createUserResponse>
```

## Schema Library

### Core Schemas
- User
- Message
- Session
- Tool
- Config
- Error

### Domain Schemas
- Chat
- MCP
- Database
- API
- Events

## Development

### Adding New Schemas

1. Create schema file:
```typescript
// src/chat/message.ts
import { z } from 'zod'

export const messageSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  timestamp: z.date(),
})

export type Message = z.infer<typeof messageSchema>
```

2. Export from index:
```typescript
// src/index.ts
export * from './chat/message'
```

### Testing
```bash
pnpm test
pnpm test:watch
```

### Linting
```bash
pnpm lint
pnpm type-check
```

## Validation Utilities

### Type Guards
```typescript
import { isUser, isMessage } from '@danky/schema'

if (isUser(data)) {
  // data is typed as User
}

if (isMessage(data)) {
  // data is typed as Message
}
```

### Error Formatting
```typescript
import { formatZodError } from '@danky/schema'

try {
  schema.parse(data)
} catch (error) {
  const formatted = formatZodError(error)
  console.error(formatted)
}
```

## Troubleshooting

### Common Issues
1. **Type Errors**: Check schema definitions
2. **Validation Errors**: Check input data
3. **Circular Dependencies**: Check imports
4. **Performance**: Check schema complexity

### Debug Tools
- Type checkers
- Schema validators
- Error formatters
- Test utilities

## Additional Resources

- [Type System Guide](../../docs/TYPES.md)
- [Validation Guide](../../docs/VALIDATION.md)
- [Schema Best Practices](../../docs/SCHEMAS.md)
- [Error Handling Guide](../../docs/ERRORS.md)

# @danky/logger

Structured logging utilities for the Danky AI Chatbot platform, built with Pino.

## Overview

The logger package provides a standardized logging interface across the platform, with support for structured logging, log levels, and various transports. It's built on top of Pino for high performance.

## Directory Structure

```
src/
├── config/          # Logger configuration
├── transports/      # Log transports
├── formatters/      # Log formatters
└── types/           # TypeScript types
```

## Key Features

- **Structured Logging**: JSON-based log format
- **Performance**: High-speed logging with Pino
- **Type Safety**: Full TypeScript coverage
- **Log Levels**: Configurable log levels
- **Transports**: Multiple output targets
- **Context**: Request-scoped logging

## Usage

### Basic Logging

```typescript
import { logger } from '@danky/logger'

// Simple logging
logger.info('Hello world')

// With context
logger.info({ userId: '123' }, 'User logged in')

// Error logging
try {
  throw new Error('Something went wrong')
} catch (error) {
  logger.error({ error }, 'Operation failed')
}
```

### Request Context

```typescript
import { withRequestContext } from '@danky/logger'

export async function handler(req: Request) {
  const log = withRequestContext(req)
  log.info('Processing request')

  try {
    // Operation
  } catch (error) {
    log.error({ error }, 'Request failed')
  }
}
```

## AI Development Notes

### Key Concepts

1. **Log Levels**
   - trace: Verbose debugging
   - debug: Debugging information
   - info: General information
   - warn: Warning messages
   - error: Error messages
   - fatal: Critical errors

2. **Context Management**
   - Request-scoped logging
   - Error serialization
   - Performance metrics
   - User context

3. **Best Practices**
   - Use structured data
   - Include error stacks
   - Add request IDs
   - Keep messages concise

### Common Patterns

#### Error Logging
```typescript
import { logger } from '@danky/logger'

try {
  await operation()
} catch (error) {
  logger.error({
    error,
    context: {
      operation: 'operation_name',
      input: data,
    },
  }, 'Operation failed')
  throw error
}
```

#### Performance Logging
```typescript
import { logger } from '@danky/logger'

const start = performance.now()
try {
  await operation()
} finally {
  const duration = performance.now() - start
  logger.info({ duration }, 'Operation completed')
}
```

#### Request Logging
```typescript
import { logger } from '@danky/logger'

export async function middleware(req: Request) {
  const requestId = crypto.randomUUID()
  const log = logger.child({ requestId })

  log.info({
    method: req.method,
    url: req.url,
  }, 'Request received')

  try {
    const response = await handler(req)
    log.info({ status: response.status }, 'Request completed')
    return response
  } catch (error) {
    log.error({ error }, 'Request failed')
    throw error
  }
}
```

## Configuration

### Environment Variables
```env
LOG_LEVEL=info
LOG_PRETTY=true
LOG_FILE=logs/app.log
```

### Logger Options
```typescript
{
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  serializers: {
    error: errorSerializer,
    request: requestSerializer,
  },
}
```

## Development

### Setup
```bash
pnpm install
pnpm build
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

## Troubleshooting

### Common Issues
1. **Performance**: Check log levels
2. **Memory Usage**: Monitor log size
3. **Missing Context**: Verify child loggers
4. **Transport Errors**: Check file permissions

### Debug Tools
- pino-pretty for development
- pino-tee for splitting output
- pino-debug for debug logs

## Additional Resources

- [Logging Best Practices](../../docs/LOGGING.md)
- [Error Handling Guide](../../docs/ERRORS.md)
- [Performance Guide](../../docs/PERFORMANCE.md)
- [Monitoring Guide](../../docs/MONITORING.md)

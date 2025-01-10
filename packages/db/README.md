# @danky/db

Database schema, migrations, and utilities for the Danky AI Chatbot platform, built with Drizzle ORM.

## Overview

The db package provides the database schema, migrations, and utilities for interacting with the PostgreSQL database. It uses Drizzle ORM for type-safe database operations and schema management.

## Directory Structure

```
src/
├── schema/          # Database schema definitions
├── migrations/      # Database migrations
├── queries/         # Reusable queries
├── utils/           # Database utilities
└── types/           # TypeScript types
```

## Key Features

- **Type Safety**: Full TypeScript coverage
- **Migrations**: Automated schema migrations
- **Query Builder**: Type-safe query building
- **Connection Pool**: Connection management
- **Error Handling**: Custom error types
- **Testing**: Database test utilities

## Usage

### Basic Query

```typescript
import { db } from '@danky/db'
import { eq } from 'drizzle-orm'
import { users } from './schema'

// Find user by ID
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
})

// Insert new user
const newUser = await db.insert(users).values({
  name: 'John Doe',
  email: 'john@example.com',
}).returning()
```

### Transactions

```typescript
import { db } from '@danky/db'

await db.transaction(async (tx) => {
  const user = await tx.insert(users).values({
    name: 'John Doe',
  }).returning()

  await tx.insert(profiles).values({
    userId: user.id,
    bio: 'Hello world',
  })
})
```

## AI Development Notes

### Key Concepts

1. **Schema Design**
   - Table definitions
   - Relationships
   - Indexes
   - Constraints

2. **Query Patterns**
   - CRUD operations
   - Joins
   - Aggregations
   - Transactions

3. **Error Handling**
   - Connection errors
   - Query errors
   - Constraint violations
   - Deadlocks

### Common Patterns

#### Table Definition
```typescript
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  bio: text('bio'),
})
```

#### Query Builder
```typescript
import { and, eq, like } from 'drizzle-orm'

const users = await db.query.users.findMany({
  where: and(
    eq(users.role, 'admin'),
    like(users.email, '%@example.com')
  ),
  with: {
    profile: true,
  },
  orderBy: users.createdAt,
  limit: 10,
})
```

#### Error Handling
```typescript
import { DatabaseError } from '@danky/db'
import { logger } from '@danky/logger'

try {
  await db.query.users.findFirst({
    where: eq(users.id, userId),
  })
} catch (error) {
  if (error instanceof DatabaseError) {
    logger.error({ error }, 'Database query failed')
    throw new Error('Failed to fetch user')
  }
  throw error
}
```

## Database Schema

### Core Tables
- users
- sessions
- messages
- tools
- files
- events

### Relationships
- User -> Messages (1:N)
- User -> Sessions (1:N)
- Message -> Files (N:M)
- Tool -> Events (1:N)

## Development

### Migrations

1. Create migration:
```bash
pnpm db:migration:create
```

2. Apply migrations:
```bash
pnpm db:migrate
```

3. Rollback migration:
```bash
pnpm db:rollback
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

## Configuration

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
DATABASE_POOL_SIZE=10
DATABASE_IDLE_TIMEOUT=10000
```

### Connection Options
```typescript
{
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
  max: parseInt(process.env.DATABASE_POOL_SIZE || '10'),
  idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '10000'),
}
```

## Troubleshooting

### Common Issues
1. **Connection Errors**: Check credentials
2. **Migration Failures**: Check schema changes
3. **Performance Issues**: Check indexes
4. **Deadlocks**: Check transaction patterns

### Debug Tools
- pg_stat_statements
- explain analyze
- pgbouncer stats
- connection pooler

## Additional Resources

- [Schema Documentation](../../docs/SCHEMA.md)
- [Migration Guide](../../docs/MIGRATIONS.md)
- [Query Patterns](../../docs/QUERIES.md)
- [Performance Guide](../../docs/PERFORMANCE.md)

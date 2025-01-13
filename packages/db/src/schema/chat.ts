import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { sessions } from './sessions';

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  metadata: text('metadata'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Zod schemas for type validation
export const insertChatSchema = createInsertSchema(chats, {
  content: z.string().min(1),
  role: z.enum(['user', 'assistant', 'system']),
  metadata: z.string().optional(),
  sessionId: z.string().uuid(),
});

export const selectChatSchema = createSelectSchema(chats);

// TypeScript types
export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;

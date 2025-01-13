import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  modelId: text('model_id').notNull(),
  description: text('description'),
  metadata: text('metadata'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  isArchived: boolean('is_archived').notNull().default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Zod schemas for type validation
export const insertSessionSchema = createInsertSchema(sessions, {
  title: z.string().min(1),
  modelId: z.string().min(1),
  description: z.string().optional(),
  metadata: z.string().optional(),
  userId: z.string().uuid(),
  isArchived: z.boolean().default(false),
});

export const selectSessionSchema = createSelectSchema(sessions);

// TypeScript types
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

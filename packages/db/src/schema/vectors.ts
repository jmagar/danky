import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

// Create the vectors table in the vector schema
export const embeddings = pgTable(
  'embeddings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    contentId: uuid('content_id').notNull(),
    contentType: text('content_type').notNull(),
    embedding: text('embedding').notNull(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    contentIdx: sql`CREATE INDEX IF NOT EXISTS idx_embeddings_content ON ${table} (content_id, content_type)`,
    vectorIdx: sql`CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON ${table} USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)`,
  })
);

// Zod schemas for type validation
export const insertEmbeddingSchema = createInsertSchema(embeddings, {
  contentId: z.string().uuid(),
  contentType: z.string().min(1),
  embedding: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

export const selectEmbeddingSchema = createSelectSchema(embeddings);

// TypeScript types
export type Embedding = typeof embeddings.$inferSelect;
export type NewEmbedding = typeof embeddings.$inferInsert;

// Helper function to create vector from array
export function createVector(array: number[]): unknown {
  return sql`array[${sql.join(array)}]::vector`;
}

// Helper function for vector similarity search
export function vectorSimilarity(column: unknown, vector: unknown) {
  return sql<number>`${column} <=> ${vector}`;
}

import { z } from 'zod';
import { idField, timestampFields } from './types';

// Base vector schema
export const vectorSchema = z.object({
  ...idField,
  contentId: z.string().uuid(),
  contentType: z.string().min(1),
  embedding: z.array(z.number()), // We convert to/from pgvector at the DB layer
  metadata: z.record(z.unknown()).optional(),
  ...timestampFields,
});

// Request schemas
export const createVectorRequestSchema = z.object({
  contentId: z.string().uuid(),
  contentType: z.string().min(1),
  embedding: z.array(z.number()),
  metadata: z.record(z.unknown()).optional(),
});

export const searchVectorRequestSchema = z.object({
  embedding: z.array(z.number()),
  contentType: z.string().min(1).optional(),
  limit: z.number().int().positive().max(100).default(10),
  threshold: z.number().min(0).max(1).default(0.8),
});

// Response schemas
export const vectorResponseSchema = z.object({
  success: z.boolean(),
  data: vectorSchema.optional(),
  error: z.string().optional(),
});

export const searchVectorResponseSchema = z.object({
  success: z.boolean(),
  results: z
    .array(
      z.object({
        vector: vectorSchema,
        similarity: z.number(),
      })
    )
    .optional(),
  error: z.string().optional(),
});

// Export types
export type Vector = z.infer<typeof vectorSchema>;
export type CreateVectorRequest = z.infer<typeof createVectorRequestSchema>;
export type SearchVectorRequest = z.infer<typeof searchVectorRequestSchema>;
export type VectorResponse = z.infer<typeof vectorResponseSchema>;
export type SearchVectorResponse = z.infer<typeof searchVectorResponseSchema>;

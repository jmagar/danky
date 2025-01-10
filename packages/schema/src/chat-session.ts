import { z } from 'zod';
import { baseResponseSchema } from './types';
import { sessionMetadataSchema, MODEL_IDS } from './metadata';

// Chat session schema
export const chatSessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  modelId: z.enum(MODEL_IDS),
  userId: z.string().uuid(),
  isArchived: z.boolean().default(false),
  metadata: sessionMetadataSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

// Create session request
export const createSessionRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  modelId: z.enum(MODEL_IDS),
  metadata: sessionMetadataSchema.optional(),
});

// Create session response
export const createSessionResponseSchema = baseResponseSchema.extend({
  data: chatSessionSchema.optional(),
});

// List sessions request
export const listSessionsRequestSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().min(1).max(100),
  search: z.string().max(255).optional(),
  modelId: z.enum(MODEL_IDS).optional(),
  isArchived: z.boolean().optional(),
  includeDeleted: z.boolean().default(false),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// List sessions response
export const listSessionsResponseSchema = baseResponseSchema.extend({
  data: z.object({
    sessions: z.array(chatSessionSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
      totalItems: z.number(),
    }),
  }).optional(),
});

// Update session request
export const updateSessionRequestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  modelId: z.enum(MODEL_IDS).optional(),
  isArchived: z.boolean().optional(),
  metadata: sessionMetadataSchema.optional(),
});

// Update session response
export const updateSessionResponseSchema = baseResponseSchema.extend({
  data: chatSessionSchema.optional(),
});

// Delete session request
export const deleteSessionRequestSchema = z.object({
  id: z.string().uuid(),
  permanent: z.boolean().default(false),
});

// Delete session response
export const deleteSessionResponseSchema = baseResponseSchema.extend({
  data: z.object({
    id: z.string(),
    deletedAt: z.date(),
  }).optional(),
});

// Restore session request
export const restoreSessionRequestSchema = z.object({
  id: z.string().uuid(),
});

// Restore session response
export const restoreSessionResponseSchema = baseResponseSchema.extend({
  data: chatSessionSchema.optional(),
}); 
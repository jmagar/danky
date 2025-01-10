import { z } from 'zod';
import { baseResponseSchema } from './types';
import { messageMetadataSchema, messageContentSchema } from './metadata';

// Message role schema
export const messageRoleSchema = z.enum(['user', 'assistant', 'system', 'tool', 'function']);

// Chat message schema
export const chatMessageSchema = z.object({
  id: z.string().uuid(),
  role: messageRoleSchema,
  content: z.array(messageContentSchema).min(1),
  sessionId: z.string().uuid(),
  metadata: messageMetadataSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

// Create message request
export const createMessageRequestSchema = z.object({
  sessionId: z.string().uuid(),
  role: messageRoleSchema,
  content: z.array(messageContentSchema).min(1),
  metadata: messageMetadataSchema.optional(),
});

// Create message response
export const createMessageResponseSchema = baseResponseSchema.extend({
  data: chatMessageSchema.optional(),
});

// List messages request
export const listMessagesRequestSchema = z.object({
  sessionId: z.string().uuid(),
  page: z.number().int().positive(),
  limit: z.number().int().min(1).max(100),
  includeDeleted: z.boolean().default(false),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// List messages response
export const listMessagesResponseSchema = baseResponseSchema.extend({
  data: z.object({
    messages: z.array(chatMessageSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
      totalItems: z.number(),
    }),
  }).optional(),
});

// Delete message request
export const deleteMessageRequestSchema = z.object({
  id: z.string().uuid(),
  permanent: z.boolean().default(false),
});

// Delete message response
export const deleteMessageResponseSchema = baseResponseSchema.extend({
  data: z.object({
    id: z.string(),
    deletedAt: z.date(),
  }).optional(),
});

// Restore message request
export const restoreMessageRequestSchema = z.object({
  id: z.string().uuid(),
});

// Restore message response
export const restoreMessageResponseSchema = baseResponseSchema.extend({
  data: chatMessageSchema.optional(),
}); 
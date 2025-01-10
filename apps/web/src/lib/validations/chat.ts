import { z } from 'zod';
import { createMessageRequestSchema, listMessagesRequestSchema } from '@danky/schema';

// Extend the base create message schema with app-specific fields
export const webCreateMessageSchema = createMessageRequestSchema.extend({
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
    size: z.number(),
  })).optional(),
});

// Extend the base list messages schema with app-specific fields
export const webListMessagesSchema = listMessagesRequestSchema.extend({
  includeDeleted: z.boolean().default(false),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Chat settings schema
export const chatSettingsSchema = z.object({
  model: z.string(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().max(4096).default(1024),
  topP: z.number().min(0).max(1).default(1),
  frequencyPenalty: z.number().min(-2).max(2).default(0),
  presencePenalty: z.number().min(-2).max(2).default(0),
}); 
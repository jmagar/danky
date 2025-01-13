import { z } from 'zod';

// Export base types
export * from './types';
export * from './metadata';

// Export vector schemas
export * from './vector';

// Export message schemas
export * from './chat';

// Export session schemas
export * from './chat-session';

// Export batch schemas
export * from './chat-batch';

// Base schemas
export const messageContentSchema = z.object({
  type: z.enum(['text', 'code', 'image']),
  content: z.string(),
  language: z.string().optional(),
});

export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.array(messageContentSchema),
  sessionId: z.string(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const sessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  modelId: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Request/Response schemas
export const createSessionRequestSchema = z.object({
  title: z.string(),
  modelId: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const createSessionResponseSchema = z.object({
  success: z.boolean(),
  data: sessionSchema.optional(),
  error: z.string().optional(),
});

// Export types
export type Message = z.infer<typeof messageSchema>;
export type Session = z.infer<typeof sessionSchema>;

import { z } from 'zod';
import { baseResponseSchema } from './types';
import { messageMetadataSchema, messageContentSchema, MODEL_IDS } from './metadata';
import { messageRoleSchema } from './chat';
import { chatSessionSchema } from './chat-session';

// Constants
const MAX_BATCH_SIZE = 100;
const MIN_BATCH_SIZE = 1;

// Batch delete sessions request
export const batchDeleteSessionsRequestSchema = z.object({
  sessionIds: z.array(z.string().uuid()).min(MIN_BATCH_SIZE).max(MAX_BATCH_SIZE),
  permanent: z.boolean().default(false),
});

// Batch delete sessions response
export const batchDeleteSessionsResponseSchema = baseResponseSchema.extend({
  data: z.object({
    deletedCount: z.number(),
    deletedIds: z.array(z.string()),
    errors: z.array(z.object({
      id: z.string(),
      error: z.string(),
    })).optional(),
  }).optional(),
});

// Batch restore sessions request
export const batchRestoreSessionsRequestSchema = z.object({
  sessionIds: z.array(z.string().uuid()).min(MIN_BATCH_SIZE).max(MAX_BATCH_SIZE),
});

// Batch restore sessions response
export const batchRestoreSessionsResponseSchema = baseResponseSchema.extend({
  data: z.object({
    restoredCount: z.number(),
    restoredSessions: z.array(chatSessionSchema),
    errors: z.array(z.object({
      id: z.string(),
      error: z.string(),
    })).optional(),
  }).optional(),
});

// Batch archive sessions request
export const batchArchiveSessionsRequestSchema = z.object({
  sessionIds: z.array(z.string().uuid()).min(MIN_BATCH_SIZE).max(MAX_BATCH_SIZE),
  archive: z.boolean().default(true),
});

// Batch archive sessions response
export const batchArchiveSessionsResponseSchema = baseResponseSchema.extend({
  data: z.object({
    updatedCount: z.number(),
    updatedIds: z.array(z.string()),
    errors: z.array(z.object({
      id: z.string(),
      error: z.string(),
    })).optional(),
  }).optional(),
});

// Batch update sessions request
export const batchUpdateSessionsRequestSchema = z.object({
  sessions: z.array(z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    modelId: z.enum(MODEL_IDS).optional(),
    isArchived: z.boolean().optional(),
    metadata: z.record(z.unknown()).optional(),
  })).min(MIN_BATCH_SIZE).max(MAX_BATCH_SIZE),
});

// Batch update sessions response
export const batchUpdateSessionsResponseSchema = baseResponseSchema.extend({
  data: z.object({
    updatedCount: z.number(),
    updatedSessions: z.array(chatSessionSchema),
    errors: z.array(z.object({
      id: z.string(),
      error: z.string(),
    })).optional(),
  }).optional(),
});

// Batch delete messages request
export const batchDeleteMessagesRequestSchema = z.object({
  messageIds: z.array(z.string().uuid()).min(MIN_BATCH_SIZE).max(MAX_BATCH_SIZE),
  permanent: z.boolean().default(false),
});

// Batch delete messages response
export const batchDeleteMessagesResponseSchema = baseResponseSchema.extend({
  data: z.object({
    deletedCount: z.number(),
    deletedIds: z.array(z.string()),
    errors: z.array(z.object({
      id: z.string(),
      error: z.string(),
    })).optional(),
  }).optional(),
});

// Batch restore messages request
export const batchRestoreMessagesRequestSchema = z.object({
  messageIds: z.array(z.string().uuid()).min(MIN_BATCH_SIZE).max(MAX_BATCH_SIZE),
});

// Batch restore messages response
export const batchRestoreMessagesResponseSchema = baseResponseSchema.extend({
  data: z.object({
    restoredCount: z.number(),
    restoredIds: z.array(z.string()),
    errors: z.array(z.object({
      id: z.string(),
      error: z.string(),
    })).optional(),
  }).optional(),
});

// Batch create messages request
export const batchCreateMessagesRequestSchema = z.object({
  sessionId: z.string().uuid(),
  messages: z.array(z.object({
    role: messageRoleSchema,
    content: z.array(messageContentSchema).min(1),
    metadata: messageMetadataSchema.optional(),
  })).min(MIN_BATCH_SIZE).max(MAX_BATCH_SIZE),
});

// Batch create messages response
export const batchCreateMessagesResponseSchema = baseResponseSchema.extend({
  data: z.object({
    createdCount: z.number(),
    messages: z.array(z.object({
      id: z.string(),
      role: messageRoleSchema,
      content: z.array(messageContentSchema),
      sessionId: z.string(),
      metadata: messageMetadataSchema.optional(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })),
    errors: z.array(z.object({
      index: z.number(),
      error: z.string(),
    })).optional(),
  }).optional(),
}); 
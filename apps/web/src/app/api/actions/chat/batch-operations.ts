'use server';

import { z } from 'zod';
import {
  batchDeleteSessionsRequestSchema,
  batchDeleteSessionsResponseSchema,
  batchRestoreSessionsRequestSchema,
  batchRestoreSessionsResponseSchema,
  batchArchiveSessionsRequestSchema,
  batchArchiveSessionsResponseSchema,
  batchUpdateSessionsRequestSchema,
  batchUpdateSessionsResponseSchema,
  batchDeleteMessagesRequestSchema,
  batchDeleteMessagesResponseSchema,
  batchRestoreMessagesRequestSchema,
  batchRestoreMessagesResponseSchema,
  batchCreateMessagesRequestSchema,
  batchCreateMessagesResponseSchema,
} from '@danky/schema';
import {
  batchDeleteSessions,
  batchRestoreSessions,
  batchArchiveSessions,
  batchUpdateSessions,
} from '@/lib/db/chat/batch-sessions';
import {
  batchDeleteMessages,
  batchRestoreMessages,
  batchCreateMessages,
} from '@/lib/db/chat/batch';
import { withUser } from '@/lib/session';
import { withErrorHandling } from '@/lib/errors';

// Session batch operations
async function batchDeleteSessionsHandler(
  input: z.infer<typeof batchDeleteSessionsRequestSchema>
) {
  return withUser(async (user) => {
    // Delete sessions
    const deleted = await batchDeleteSessions(input, user.id);

    // Return success response
    return batchDeleteSessionsResponseSchema.parse({
      success: true,
      data: {
        deletedCount: deleted.length,
        deletedIds: deleted.map(s => s.id),
      },
    });
  });
}

async function batchRestoreSessionsHandler(
  input: z.infer<typeof batchRestoreSessionsRequestSchema>
) {
  return withUser(async (user) => {
    // Restore sessions
    const restored = await batchRestoreSessions(input, user.id);

    // Return success response
    return batchRestoreSessionsResponseSchema.parse({
      success: true,
      data: {
        restoredCount: restored.length,
        restoredSessions: restored,
      },
    });
  });
}

async function batchArchiveSessionsHandler(
  input: z.infer<typeof batchArchiveSessionsRequestSchema>
) {
  return withUser(async (user) => {
    // Archive/unarchive sessions
    const updated = await batchArchiveSessions(input, user.id);

    // Return success response
    return batchArchiveSessionsResponseSchema.parse({
      success: true,
      data: {
        updatedCount: updated.length,
        updatedIds: updated.map(s => s.id),
      },
    });
  });
}

async function batchUpdateSessionsHandler(
  input: z.infer<typeof batchUpdateSessionsRequestSchema>
) {
  return withUser(async (user) => {
    // Update sessions
    const updated = await batchUpdateSessions(input, user.id);

    // Return success response
    return batchUpdateSessionsResponseSchema.parse({
      success: true,
      data: {
        updatedCount: updated.length,
        updatedSessions: updated,
      },
    });
  });
}

// Message batch operations
async function batchDeleteMessagesHandler(
  input: z.infer<typeof batchDeleteMessagesRequestSchema>
) {
  return withUser(async (user) => {
    // Delete messages
    const deleted = await batchDeleteMessages(input, user.id);

    // Return success response
    return batchDeleteMessagesResponseSchema.parse({
      success: true,
      data: {
        deletedCount: deleted.length,
        deletedIds: deleted.map(m => m.id),
      },
    });
  });
}

async function batchRestoreMessagesHandler(
  input: z.infer<typeof batchRestoreMessagesRequestSchema>
) {
  return withUser(async (user) => {
    // Restore messages
    const restored = await batchRestoreMessages(input, user.id);

    // Return success response
    return batchRestoreMessagesResponseSchema.parse({
      success: true,
      data: {
        restoredCount: restored.length,
        restoredIds: restored.map(m => m.id),
      },
    });
  });
}

async function batchCreateMessagesHandler(
  input: z.infer<typeof batchCreateMessagesRequestSchema>
) {
  return withUser(async (user) => {
    // Create messages
    const messages = await batchCreateMessages(input, user.id);

    // Return success response
    return batchCreateMessagesResponseSchema.parse({
      success: true,
      data: {
        createdCount: messages.length,
        messages: messages.map(m => ({
          id: m.id,
          role: m.role,
          content: [{
            type: m.contentType,
            content: m.content,
            language: m.language,
          }],
          sessionId: m.conversationId,
          metadata: m.metadata,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
        })),
      },
    });
  });
}

// Export wrapped handlers with error handling
export const batchDeleteChatSessions = withErrorHandling(
  batchDeleteSessionsHandler,
  batchDeleteSessionsResponseSchema,
  'batchDeleteSessions'
);

export const batchRestoreChatSessions = withErrorHandling(
  batchRestoreSessionsHandler,
  batchRestoreSessionsResponseSchema,
  'batchRestoreSessions'
);

export const batchArchiveChatSessions = withErrorHandling(
  batchArchiveSessionsHandler,
  batchArchiveSessionsResponseSchema,
  'batchArchiveSessions'
);

export const batchUpdateChatSessions = withErrorHandling(
  batchUpdateSessionsHandler,
  batchUpdateSessionsResponseSchema,
  'batchUpdateSessions'
);

export const batchDeleteChatMessages = withErrorHandling(
  batchDeleteMessagesHandler,
  batchDeleteMessagesResponseSchema,
  'batchDeleteMessages'
);

export const batchRestoreChatMessages = withErrorHandling(
  batchRestoreMessagesHandler,
  batchRestoreMessagesResponseSchema,
  'batchRestoreMessages'
);

export const batchCreateChatMessages = withErrorHandling(
  batchCreateMessagesHandler,
  batchCreateMessagesResponseSchema,
  'batchCreateMessages'
); 
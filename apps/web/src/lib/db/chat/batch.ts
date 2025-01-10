import { z } from 'zod';
import { db } from '@danky/db';
import { messages, conversations } from '@danky/db/schema/chat';
import { and, eq, sql, inArray } from 'drizzle-orm';
import { withBatchTransaction } from '../transaction';
import { handlePartialSuccess } from '../../errors';
import { logger } from '@danky/logger';
import {
  batchCreateMessagesRequestSchema,
  batchDeleteMessagesRequestSchema,
  batchRestoreMessagesRequestSchema,
} from '@danky/schema';

// Batch create messages
export async function batchCreateMessages(
  input: z.infer<typeof batchCreateMessagesRequestSchema>,
  userId: string
) {
  return withBatchTransaction(
    input.messages.map((message) => async (tx) => {
      // First verify the user has access to the conversation
      const [conversation] = await tx
        .select()
        .from(conversations)
        .where(and(
          eq(conversations.id, input.sessionId),
          eq(conversations.userId, userId),
          sql`${conversations.deletedAt} IS NULL`
        ))
        .execute();

      if (!conversation) {
        throw new Error('Conversation not found or access denied');
      }

      // Create message with all content blocks
      const results = await Promise.all(
        message.content.map(async (content) => {
          const [result] = await tx
            .insert(messages)
            .values({
              conversationId: input.sessionId,
              role: message.role,
              content: content.content,
              contentType: content.type,
              language: content.language,
              metadata: message.metadata,
            })
            .returning()
            .execute();

          return result;
        })
      );

      // Update conversation's updatedAt
      await tx
        .update(conversations)
        .set({ updatedAt: new Date() })
        .where(eq(conversations.id, input.sessionId))
        .execute();

      return results[0]; // Return first message for consistency
    })
  );
}

// Batch delete messages
export async function batchDeleteMessages(
  input: z.infer<typeof batchDeleteMessagesRequestSchema>,
  userId: string
) {
  return withBatchTransaction(
    [async (tx) => {
      // Verify user has access to all messages
      const messagesToDelete = await tx
        .select({
          id: messages.id,
          conversationId: messages.conversationId,
        })
        .from(messages)
        .innerJoin(
          conversations,
          eq(messages.conversationId, conversations.id)
        )
        .where(and(
          inArray(messages.id, input.messageIds),
          eq(conversations.userId, userId),
          sql`${messages.deletedAt} IS NULL`
        ))
        .execute();

      const foundIds = new Set(messagesToDelete.map(m => m.id));
      const notFound = input.messageIds.filter(id => !foundIds.has(id));

      if (notFound.length > 0) {
        throw new Error(`Messages not found or access denied: ${notFound.join(', ')}`);
      }

      // Delete messages
      const deleted = await tx
        .update(messages)
        .set(
          input.permanent
            ? { deletedAt: new Date() }
            : { softDeletedAt: new Date() }
        )
        .where(inArray(messages.id, input.messageIds))
        .returning()
        .execute();

      // Update conversations' updatedAt
      const conversationIds = [...new Set(messagesToDelete.map(m => m.conversationId))];
      await Promise.all(
        conversationIds.map(conversationId =>
          tx
            .update(conversations)
            .set({ updatedAt: new Date() })
            .where(eq(conversations.id, conversationId))
            .execute()
        )
      );

      return deleted;
    }]
  );
}

// Batch restore messages
export async function batchRestoreMessages(
  input: z.infer<typeof batchRestoreMessagesRequestSchema>,
  userId: string
) {
  return withBatchTransaction(
    [async (tx) => {
      // Verify user has access to all messages
      const messagesToRestore = await tx
        .select({
          id: messages.id,
          conversationId: messages.conversationId,
        })
        .from(messages)
        .innerJoin(
          conversations,
          eq(messages.conversationId, conversations.id)
        )
        .where(and(
          inArray(messages.id, input.messageIds),
          eq(conversations.userId, userId),
          sql`${messages.deletedAt} IS NOT NULL`
        ))
        .execute();

      const foundIds = new Set(messagesToRestore.map(m => m.id));
      const notFound = input.messageIds.filter(id => !foundIds.has(id));

      if (notFound.length > 0) {
        throw new Error(`Messages not found or access denied: ${notFound.join(', ')}`);
      }

      // Restore messages
      const restored = await tx
        .update(messages)
        .set({
          deletedAt: null,
          softDeletedAt: null,
        })
        .where(inArray(messages.id, input.messageIds))
        .returning()
        .execute();

      // Update conversations' updatedAt
      const conversationIds = [...new Set(messagesToRestore.map(m => m.conversationId))];
      await Promise.all(
        conversationIds.map(conversationId =>
          tx
            .update(conversations)
            .set({ updatedAt: new Date() })
            .where(eq(conversations.id, conversationId))
            .execute()
        )
      );

      return restored;
    }]
  );
} 
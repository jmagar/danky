import { db } from '@danky/db';
import { messages, conversations } from '@danky/db/schema/chat';
import { and, desc, eq, sql, ilike, or, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { webListMessagesSchema } from '../validations/chat';
import { 
  createSessionRequestSchema, 
  listSessionsRequestSchema, 
  updateSessionRequestSchema,
  deleteSessionRequestSchema,
  createMessageRequestSchema 
} from '@danky/schema';
import { withWriteTransaction, withReadOnlyTransaction } from './transaction';
import { ForbiddenError, NotFoundError } from '../errors';

export async function getMessages(input: z.infer<typeof webListMessagesSchema>) {
  return withReadOnlyTransaction(async (tx) => {
    const { sessionId, page, limit, includeDeleted, sortOrder } = input;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = and(
      eq(messages.conversationId, sessionId),
      includeDeleted ? undefined : isNull(messages.deletedAt)
    );
    
    // Get total count first
    const [countResult] = await tx
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(whereClause)
      .execute();
      
    const totalItems = Number(countResult?.count ?? 0);
    const totalPages = Math.ceil(totalItems / limit);
    
    // Get paginated messages
    const results = await tx
      .select()
      .from(messages)
      .where(whereClause)
      .orderBy(sortOrder === 'desc' ? desc(messages.createdAt) : messages.createdAt)
      .limit(limit)
      .offset(offset)
      .execute();
      
    return {
      messages: results,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
      }
    };
  });
}

export async function createSession(input: z.infer<typeof createSessionRequestSchema>, userId: string) {
  return withWriteTransaction(async (tx) => {
    const result = await tx
      .insert(conversations)
      .values({
        title: input.name,
        userId,
        modelId: input.modelId,
        description: input.description,
        isArchived: false,
        metadata: input.metadata,
      })
      .returning()
      .execute();

    return result[0];
  });
}

export async function getSessions(input: z.infer<typeof listSessionsRequestSchema>, userId: string) {
  return withReadOnlyTransaction(async (tx) => {
    const { page, limit, search } = input;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = and(
      eq(conversations.userId, userId),
      isNull(conversations.deletedAt),
      search ? ilike(conversations.title, `%${search}%`) : undefined
    );

    // Get total count first
    const [countResult] = await tx
      .select({ count: sql<number>`count(*)` })
      .from(conversations)
      .where(whereClause)
      .execute();

    const totalItems = Number(countResult?.count ?? 0);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated sessions
    const results = await tx
      .select()
      .from(conversations)
      .where(whereClause)
      .orderBy(desc(conversations.updatedAt))
      .limit(limit)
      .offset(offset)
      .execute();

    return {
      sessions: results,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
      }
    };
  });
}

export async function updateSession(input: z.infer<typeof updateSessionRequestSchema>, userId: string) {
  return withWriteTransaction(async (tx) => {
    // Verify session exists and user has access
    const [session] = await tx
      .select()
      .from(conversations)
      .where(and(
        eq(conversations.id, input.id),
        eq(conversations.userId, userId),
        isNull(conversations.deletedAt)
      ))
      .execute();

    if (!session) {
      throw new NotFoundError('Session not found or access denied');
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (input.name) updateData.title = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.modelId) updateData.modelId = input.modelId;
    if (input.metadata) updateData.metadata = input.metadata;

    // Update session
    const [updated] = await tx
      .update(conversations)
      .set(updateData)
      .where(eq(conversations.id, input.id))
      .returning()
      .execute();

    return updated;
  });
}

export async function deleteSession(input: z.infer<typeof deleteSessionRequestSchema>, userId: string) {
  return withWriteTransaction(async (tx) => {
    // Verify session exists and user has access
    const [session] = await tx
      .select()
      .from(conversations)
      .where(and(
        eq(conversations.id, input.id),
        eq(conversations.userId, userId),
        isNull(conversations.deletedAt)
      ))
      .execute();

    if (!session) {
      throw new NotFoundError('Session not found or access denied');
    }

    // Soft delete the session
    const [deleted] = await tx
      .update(conversations)
      .set({ 
        deletedAt: new Date(),
        isArchived: true 
      })
      .where(eq(conversations.id, input.id))
      .returning()
      .execute();

    return deleted;
  });
}

// Batch operations
export async function batchDeleteSessions(sessionIds: string[], userId: string) {
  return withWriteTransaction(async (tx) => {
    // Verify all sessions exist and user has access
    const sessions = await tx
      .select()
      .from(conversations)
      .where(and(
        eq(conversations.userId, userId),
        isNull(conversations.deletedAt)
      ))
      .execute();

    const sessionSet = new Set(sessions.map(s => s.id));
    const invalidSessions = sessionIds.filter(id => !sessionSet.has(id));

    if (invalidSessions.length > 0) {
      throw new NotFoundError(`Some sessions not found or access denied: ${invalidSessions.join(', ')}`);
    }

    // Soft delete all sessions
    const deleted = await tx
      .update(conversations)
      .set({ 
        deletedAt: new Date(),
        isArchived: true 
      })
      .where(and(
        sql`${conversations.id} = ANY(${sessionIds})`,
        eq(conversations.userId, userId)
      ))
      .returning()
      .execute();

    return deleted;
  });
}

export async function batchArchiveSessions(sessionIds: string[], userId: string, archive: boolean = true) {
  return withWriteTransaction(async (tx) => {
    // Verify all sessions exist and user has access
    const sessions = await tx
      .select()
      .from(conversations)
      .where(and(
        eq(conversations.userId, userId),
        isNull(conversations.deletedAt)
      ))
      .execute();

    const sessionSet = new Set(sessions.map(s => s.id));
    const invalidSessions = sessionIds.filter(id => !sessionSet.has(id));

    if (invalidSessions.length > 0) {
      throw new NotFoundError(`Some sessions not found or access denied: ${invalidSessions.join(', ')}`);
    }

    // Update archive status
    const updated = await tx
      .update(conversations)
      .set({ isArchived: archive })
      .where(and(
        sql`${conversations.id} = ANY(${sessionIds})`,
        eq(conversations.userId, userId)
      ))
      .returning()
      .execute();

    return updated;
  });
}

export async function createMessage(
  input: z.infer<typeof createMessageRequestSchema>,
  userId: string
) {
  return withWriteTransaction(async (tx) => {
    // First verify the user has access to the conversation
    const [conversation] = await tx
      .select()
      .from(conversations)
      .where(and(
        eq(conversations.id, input.sessionId),
        eq(conversations.userId, userId),
        isNull(conversations.deletedAt)
      ))
      .execute();

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    if (conversation.deletedAt) {
      throw new ForbiddenError('Cannot add messages to a deleted conversation');
    }

    // Create all message content blocks
    const messages = await Promise.all(
      input.content.map(async (content) => {
        const [message] = await tx
          .insert(messages)
          .values({
            conversationId: input.sessionId,
            role: input.role,
            content: content.content,
            contentType: content.type,
            language: content.language,
            metadata: input.metadata,
          })
          .returning()
          .execute();

        return message;
      })
    );

    // Update conversation's updatedAt
    await tx
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, input.sessionId))
      .execute();

    return messages[0]; // Return first message for backward compatibility
  });
} 
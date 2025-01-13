import { z } from 'zod';
import { chats, sessions } from '@danky/db';
import { and, desc, eq, sql, ilike, isNull } from 'drizzle-orm';
import { webListMessagesSchema } from '../validations/chat';
import {
  createSessionRequestSchema,
  listSessionsRequestSchema,
  updateSessionRequestSchema,
  deleteSessionRequestSchema,
  createMessageRequestSchema,
} from '@danky/schema';
import { withWriteTransaction, withReadOnlyTransaction } from './transaction';
import { ForbiddenError, NotFoundError } from '../errors';

export async function getMessages(input: z.infer<typeof webListMessagesSchema>) {
  return withReadOnlyTransaction(async tx => {
    const { sessionId, page, limit, includeDeleted, sortOrder } = input;
    const offset = (page - 1) * limit;

    // Verify user has access to the session
    const [session] = await tx
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), isNull(sessions.deletedAt)))
      .execute();

    if (!session) {
      throw new NotFoundError('Session not found or access denied');
    }

    // Build where clause
    const whereClause = and(
      eq(chats.sessionId, sessionId),
      includeDeleted ? undefined : isNull(chats.deletedAt)
    );

    // Get total count first
    const [countResult] = await tx
      .select({ count: sql<number>`count(*)` })
      .from(chats)
      .where(whereClause)
      .execute();

    const totalItems = Number(countResult?.count ?? 0);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated messages
    const results = await tx
      .select({
        id: chats.id,
        role: chats.role,
        content: chats.content,
        sessionId: chats.sessionId,
        metadata: chats.metadata,
        createdAt: chats.createdAt,
        updatedAt: chats.updatedAt,
        deletedAt: chats.deletedAt,
      })
      .from(chats)
      .where(whereClause)
      .orderBy(sortOrder === 'desc' ? desc(chats.createdAt) : chats.createdAt)
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
      },
    };
  });
}

export async function createSession(
  input: z.infer<typeof createSessionRequestSchema>,
  userId: string
) {
  return withWriteTransaction(async tx => {
    const result = await tx
      .insert(sessions)
      .values({
        title: input.title,
        userId,
        modelId: input.modelId,
        description: input.description,
        isArchived: false,
        metadata: JSON.stringify(input.metadata),
      })
      .returning()
      .execute();

    return result[0];
  });
}

export async function getSessions(
  input: z.infer<typeof listSessionsRequestSchema>,
  userId: string
) {
  return withReadOnlyTransaction(async tx => {
    const { page, limit, search } = input;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = and(
      eq(sessions.userId, userId),
      isNull(sessions.deletedAt),
      search ? ilike(sessions.title, `%${search}%`) : undefined
    );

    // Get total count first
    const [countResult] = await tx
      .select({ count: sql<number>`count(*)` })
      .from(sessions)
      .where(whereClause)
      .execute();

    const totalItems = Number(countResult?.count ?? 0);
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated sessions
    const results = await tx
      .select()
      .from(sessions)
      .where(whereClause)
      .orderBy(desc(sessions.updatedAt))
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
      },
    };
  });
}

export async function updateSession(
  input: z.infer<typeof updateSessionRequestSchema>,
  userId: string
) {
  return withWriteTransaction(async tx => {
    // Verify session exists and user has access
    const [existingSession] = await tx
      .select()
      .from(sessions)
      .where(
        and(eq(sessions.id, input.id), eq(sessions.userId, userId), isNull(sessions.deletedAt))
      )
      .execute();

    if (!existingSession) {
      throw new NotFoundError('Session not found or access denied');
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (input.title) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.modelId) updateData.modelId = input.modelId;
    if (input.metadata) updateData.metadata = JSON.stringify(input.metadata);

    // Update session
    const [updated] = await tx
      .update(sessions)
      .set(updateData)
      .where(eq(sessions.id, input.id))
      .returning()
      .execute();

    return updated;
  });
}

export async function deleteSession(
  input: z.infer<typeof deleteSessionRequestSchema>,
  userId: string
) {
  return withWriteTransaction(async tx => {
    // Verify session exists and user has access
    const [existingSession] = await tx
      .select()
      .from(sessions)
      .where(
        and(eq(sessions.id, input.id), eq(sessions.userId, userId), isNull(sessions.deletedAt))
      )
      .execute();

    if (!existingSession) {
      throw new NotFoundError('Session not found or access denied');
    }

    // Soft delete the session
    const [deleted] = await tx
      .update(sessions)
      .set({
        deletedAt: new Date(),
        isArchived: true,
      })
      .where(eq(sessions.id, input.id))
      .returning()
      .execute();

    return deleted;
  });
}

// Batch operations
export async function batchDeleteSessions(sessionIds: string[], userId: string) {
  return withWriteTransaction(async tx => {
    // Verify all sessions exist and user has access
    const existingSessions = await tx
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), isNull(sessions.deletedAt)))
      .execute();

    const sessionSet = new Set(existingSessions.map(s => s.id));
    const invalidSessions = sessionIds.filter(id => !sessionSet.has(id));

    if (invalidSessions.length > 0) {
      throw new NotFoundError(
        `Some sessions not found or access denied: ${invalidSessions.join(', ')}`
      );
    }

    // Soft delete all sessions
    const deleted = await tx
      .update(sessions)
      .set({
        deletedAt: new Date(),
        isArchived: true,
      })
      .where(and(sql`${sessions.id} = ANY(${sessionIds})`, eq(sessions.userId, userId)))
      .returning()
      .execute();

    return deleted;
  });
}

export async function batchArchiveSessions(sessionIds: string[], userId: string, archive: boolean) {
  return withWriteTransaction(async tx => {
    // Verify all sessions exist and user has access
    const existingSessions = await tx
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), isNull(sessions.deletedAt)))
      .execute();

    const sessionSet = new Set(existingSessions.map(s => s.id));
    const invalidSessions = sessionIds.filter(id => !sessionSet.has(id));

    if (invalidSessions.length > 0) {
      throw new NotFoundError(
        `Some sessions not found or access denied: ${invalidSessions.join(', ')}`
      );
    }

    // Update archive status
    const updated = await tx
      .update(sessions)
      .set({ isArchived: archive })
      .where(and(sql`${sessions.id} = ANY(${sessionIds})`, eq(sessions.userId, userId)))
      .returning()
      .execute();

    return updated;
  });
}

export async function createMessage(
  input: z.infer<typeof createMessageRequestSchema>,
  userId: string
) {
  return withWriteTransaction(async tx => {
    // First verify the user has access to the session
    const [session] = await tx
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.id, input.sessionId),
          eq(sessions.userId, userId),
          isNull(sessions.deletedAt)
        )
      )
      .execute();

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    if (session.deletedAt) {
      throw new ForbiddenError('Cannot add messages to a deleted session');
    }

    // Create messages
    const messages = await Promise.all(
      input.content.map(async content => {
        const [message] = await tx
          .insert(chats)
          .values({
            sessionId: input.sessionId,
            role: input.role,
            content: content.content,
            metadata: JSON.stringify(input.metadata),
          })
          .returning()
          .execute();

        return message;
      })
    );

    // Update session's updatedAt
    await tx
      .update(sessions)
      .set({ updatedAt: new Date() })
      .where(eq(sessions.id, input.sessionId))
      .execute();

    return messages;
  });
}

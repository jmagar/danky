import { z } from 'zod';
import { db } from '@danky/db';
import { conversations } from '@danky/db/schema/chat';
import { and, eq, sql, inArray } from 'drizzle-orm';
import { withBatchTransaction } from '../transaction';
import { handlePartialSuccess } from '../../errors';
import { logger } from '@danky/logger';
import {
  batchDeleteSessionsRequestSchema,
  batchRestoreSessionsRequestSchema,
  batchArchiveSessionsRequestSchema,
  batchUpdateSessionsRequestSchema,
} from '@danky/schema';

// Batch delete sessions
export async function batchDeleteSessions(
  input: z.infer<typeof batchDeleteSessionsRequestSchema>,
  userId: string
) {
  return withBatchTransaction(
    [async (tx) => {
      // Verify user has access to all sessions
      const sessionsToDelete = await tx
        .select()
        .from(conversations)
        .where(and(
          inArray(conversations.id, input.sessionIds),
          eq(conversations.userId, userId),
          sql`${conversations.deletedAt} IS NULL`
        ))
        .execute();

      const foundIds = new Set(sessionsToDelete.map(s => s.id));
      const notFound = input.sessionIds.filter(id => !foundIds.has(id));

      if (notFound.length > 0) {
        throw new Error(`Sessions not found or access denied: ${notFound.join(', ')}`);
      }

      // Delete sessions
      const deleted = await tx
        .update(conversations)
        .set(
          input.permanent
            ? { deletedAt: new Date() }
            : { softDeletedAt: new Date() }
        )
        .where(inArray(conversations.id, input.sessionIds))
        .returning()
        .execute();

      return deleted;
    }]
  );
}

// Batch restore sessions
export async function batchRestoreSessions(
  input: z.infer<typeof batchRestoreSessionsRequestSchema>,
  userId: string
) {
  return withBatchTransaction(
    [async (tx) => {
      // Verify user has access to all sessions
      const sessionsToRestore = await tx
        .select()
        .from(conversations)
        .where(and(
          inArray(conversations.id, input.sessionIds),
          eq(conversations.userId, userId),
          sql`${conversations.deletedAt} IS NOT NULL`
        ))
        .execute();

      const foundIds = new Set(sessionsToRestore.map(s => s.id));
      const notFound = input.sessionIds.filter(id => !foundIds.has(id));

      if (notFound.length > 0) {
        throw new Error(`Sessions not found or access denied: ${notFound.join(', ')}`);
      }

      // Restore sessions
      const restored = await tx
        .update(conversations)
        .set({
          deletedAt: null,
          softDeletedAt: null,
        })
        .where(inArray(conversations.id, input.sessionIds))
        .returning()
        .execute();

      return restored;
    }]
  );
}

// Batch archive sessions
export async function batchArchiveSessions(
  input: z.infer<typeof batchArchiveSessionsRequestSchema>,
  userId: string
) {
  return withBatchTransaction(
    [async (tx) => {
      // Verify user has access to all sessions
      const sessionsToArchive = await tx
        .select()
        .from(conversations)
        .where(and(
          inArray(conversations.id, input.sessionIds),
          eq(conversations.userId, userId),
          sql`${conversations.deletedAt} IS NULL`
        ))
        .execute();

      const foundIds = new Set(sessionsToArchive.map(s => s.id));
      const notFound = input.sessionIds.filter(id => !foundIds.has(id));

      if (notFound.length > 0) {
        throw new Error(`Sessions not found or access denied: ${notFound.join(', ')}`);
      }

      // Archive/unarchive sessions
      const updated = await tx
        .update(conversations)
        .set({
          isArchived: input.archive,
          updatedAt: new Date(),
        })
        .where(inArray(conversations.id, input.sessionIds))
        .returning()
        .execute();

      return updated;
    }]
  );
}

// Batch update sessions
export async function batchUpdateSessions(
  input: z.infer<typeof batchUpdateSessionsRequestSchema>,
  userId: string
) {
  return withBatchTransaction(
    input.sessions.map((session) => async (tx) => {
      // Verify user has access to the session
      const [existing] = await tx
        .select()
        .from(conversations)
        .where(and(
          eq(conversations.id, session.id),
          eq(conversations.userId, userId),
          sql`${conversations.deletedAt} IS NULL`
        ))
        .execute();

      if (!existing) {
        throw new Error(`Session not found or access denied: ${session.id}`);
      }

      // Build update object with only provided fields
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      if (session.name) updateData.title = session.name;
      if (session.description !== undefined) updateData.description = session.description;
      if (session.modelId) updateData.modelId = session.modelId;
      if (session.isArchived !== undefined) updateData.isArchived = session.isArchived;
      if (session.metadata) updateData.metadata = session.metadata;

      // Update session
      const [updated] = await tx
        .update(conversations)
        .set(updateData)
        .where(eq(conversations.id, session.id))
        .returning()
        .execute();

      return updated;
    })
  );
} 
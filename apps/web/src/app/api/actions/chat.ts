'use server';

import { z } from 'zod';
import {
  createMessageRequestSchema,
  createMessageResponseSchema,
  chatMessageSchema,
  messageContentSchema,
  messageMetadataSchema,
  sessionMetadataSchema,
} from '@danky/schema';
import { webCreateMessageSchema } from '@/lib/validations/chat';
import { withWriteTransaction } from '@/lib/db/transaction';
import { chats, sessions } from '@danky/db';
import { eq, sql } from 'drizzle-orm';

// Helper to create a text content object
const createTextContent = (text: string) => ({
  type: 'text' as const,
  content: text,
});

export async function createMessage(input: z.infer<typeof webCreateMessageSchema>) {
  try {
    // Validate input
    const validatedInput = webCreateMessageSchema.parse(input);

    // Convert string content to content array if needed
    const content =
      typeof validatedInput.content === 'string'
        ? [createTextContent(validatedInput.content)]
        : validatedInput.content;

    return withWriteTransaction(async db => {
      // Create message in database
      const [message] = await db
        .insert(chats)
        .values({
          role: validatedInput.role,
          content: JSON.stringify(content),
          sessionId: validatedInput.sessionId,
          metadata: validatedInput.metadata ? JSON.stringify(validatedInput.metadata) : null,
        })
        .returning();

      // Update session's updated timestamp
      await db
        .update(sessions)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(sessions.id, validatedInput.sessionId));

      // Return success response
      return createMessageResponseSchema.parse({
        success: true,
        data: message,
      });
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return createMessageResponseSchema.parse({
        success: false,
        error: 'Invalid input: ' + error.errors.map(e => e.message).join(', '),
      });
    }

    // Handle other errors
    console.error('Error creating message:', error);
    return createMessageResponseSchema.parse({
      success: false,
      error: 'Failed to create message',
    });
  }
}

export async function listMessages(sessionId: string, page = 1, limit = 50) {
  try {
    const offset = (page - 1) * limit;

    return withWriteTransaction(async db => {
      // Get messages for session
      const messagesList = await db
        .select()
        .from(chats)
        .where(eq(chats.sessionId, sessionId))
        .orderBy(chats.createdAt)
        .limit(limit)
        .offset(offset);

      // Get total count
      const [{ count }] = await db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(chats)
        .where(eq(chats.sessionId, sessionId));

      const totalPages = Math.ceil(Number(count) / limit);

      return {
        success: true,
        data: {
          messages: messagesList.map(msg => ({
            ...msg,
            content: JSON.parse(msg.content),
            metadata: msg.metadata ? JSON.parse(msg.metadata) : null,
          })),
          pagination: {
            page,
            limit,
            totalPages,
            totalItems: Number(count),
          },
        },
      };
    });
  } catch (error) {
    console.error('Error listing messages:', error);
    return {
      success: false,
      error: 'Failed to list messages',
    };
  }
}

export async function deleteMessage(id: string, permanent = false) {
  try {
    return withWriteTransaction(async db => {
      if (permanent) {
        await db.delete(chats).where(eq(chats.id, id));
      } else {
        await db.update(chats).set({ deletedAt: new Date() }).where(eq(chats.id, id));
      }

      return {
        success: true,
        data: { id, deletedAt: new Date() },
      };
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return {
      success: false,
      error: 'Failed to delete message',
    };
  }
}

export async function restoreMessage(id: string) {
  try {
    return withWriteTransaction(async db => {
      const [message] = await db
        .update(chats)
        .set({ deletedAt: null })
        .where(eq(chats.id, id))
        .returning();

      return {
        success: true,
        data: message
          ? {
              ...message,
              content: JSON.parse(message.content),
              metadata: message.metadata ? JSON.parse(message.metadata) : null,
            }
          : null,
      };
    });
  } catch (error) {
    console.error('Error restoring message:', error);
    return {
      success: false,
      error: 'Failed to restore message',
    };
  }
}

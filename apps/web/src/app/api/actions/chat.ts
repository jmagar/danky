'use server';

import { z } from 'zod';
import {
  createMessageRequestSchema,
  createMessageResponseSchema,
  chatMessageSchema,
  messageContentSchema,
  messageMetadataSchema,
  sessionMetadataSchema
} from '@danky/schema';
import { webCreateMessageSchema } from '@/lib/validations/chat';
import { db } from '@/lib/db';
import { messages, sessions } from '@danky/db';
import { eq } from 'drizzle-orm';

// Helper to create a text content object
const createTextContent = (text: string) => ({
  type: 'text' as const,
  content: text
});

export async function createMessage(input: z.infer<typeof webCreateMessageSchema>) {
  try {
    // Validate input
    const validatedInput = webCreateMessageSchema.parse(input);

    // Convert string content to content array if needed
    const content = typeof validatedInput.content === 'string'
      ? [createTextContent(validatedInput.content)]
      : validatedInput.content;

    // Create message in database
    const [message] = await db.insert(messages)
      .values({
        role: validatedInput.role,
        content,
        sessionId: validatedInput.sessionId,
        metadata: validatedInput.metadata,
      })
      .returning();

    // Update session's last message
    await db.update(sessions)
      .set({
        lastMessage: content[0].content,
        updatedAt: new Date()
      })
      .where(eq(sessions.id, validatedInput.sessionId));

    // Return success response
    return createMessageResponseSchema.parse({
      success: true,
      data: message
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

    // Get messages for session
    const messagesList = await db.select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(messages.createdAt)
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ count }] = await db.select({
      count: db.fn.count()
    })
    .from(messages)
    .where(eq(messages.sessionId, sessionId));

    const totalPages = Math.ceil(Number(count) / limit);

    return {
      success: true,
      data: {
        messages: messagesList,
        pagination: {
          page,
          limit,
          totalPages,
          totalItems: Number(count)
        }
      }
    };
  } catch (error) {
    console.error('Error listing messages:', error);
    return {
      success: false,
      error: 'Failed to list messages'
    };
  }
}

export async function deleteMessage(id: string, permanent = false) {
  try {
    if (permanent) {
      await db.delete(messages).where(eq(messages.id, id));
    } else {
      await db.update(messages)
        .set({ deletedAt: new Date() })
        .where(eq(messages.id, id));
    }

    return {
      success: true,
      data: { id, deletedAt: new Date() }
    };
  } catch (error) {
    console.error('Error deleting message:', error);
    return {
      success: false,
      error: 'Failed to delete message'
    };
  }
}

export async function restoreMessage(id: string) {
  try {
    const [message] = await db.update(messages)
      .set({ deletedAt: null })
      .where(eq(messages.id, id))
      .returning();

    return {
      success: true,
      data: message
    };
  } catch (error) {
    console.error('Error restoring message:', error);
    return {
      success: false,
      error: 'Failed to restore message'
    };
  }
}

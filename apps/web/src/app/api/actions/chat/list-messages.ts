'use server';

import { z } from 'zod';
import { listMessagesResponseSchema } from '@danky/schema';
import { webListMessagesSchema } from '@/lib/validations/chat';
import { getMessages } from '@/lib/db/chat';

export async function listMessages(input: z.infer<typeof webListMessagesSchema>) {
  try {
    // Validate input
    const validatedInput = webListMessagesSchema.parse(input);

    // Query messages from database
    const { messages, pagination } = await getMessages(validatedInput);

    // Transform messages to match our schema
    const transformedMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: [{
        type: 'text' as const,
        content: msg.content,
      }],
      sessionId: msg.conversationId,
      metadata: msg.metadata,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));

    // Return success response
    return listMessagesResponseSchema.parse({
      success: true,
      data: transformedMessages,
      pagination,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return listMessagesResponseSchema.parse({
        success: false,
        error: 'Invalid input: ' + error.errors.map(e => e.message).join(', '),
      });
    }

    // Handle other errors
    console.error('Error listing messages:', error);
    return listMessagesResponseSchema.parse({
      success: false,
      error: 'Failed to list messages',
    });
  }
} 
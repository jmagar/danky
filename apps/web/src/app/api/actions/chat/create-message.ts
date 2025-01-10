'use server';

import { z } from 'zod';
import { createMessageRequestSchema, createMessageResponseSchema } from '@danky/schema';
import { createMessage } from '@/lib/db/chat';
import { withUser } from '@/lib/session';
import { withErrorHandling } from '@/lib/errors';

async function createMessageHandler(input: z.infer<typeof createMessageRequestSchema>) {
  return withUser(async (user) => {
    // Validate input
    const validatedInput = createMessageRequestSchema.parse(input);

    // Create message in database
    const message = await createMessage(validatedInput, user.id);

    // Transform message to match our schema
    const transformedMessage = {
      id: message.id,
      role: message.role,
      content: [{
        type: message.contentType,
        content: message.content,
        language: message.language,
      }],
      sessionId: message.conversationId,
      metadata: message.metadata,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };

    // Return success response
    return createMessageResponseSchema.parse({
      success: true,
      data: transformedMessage,
    });
  });
}

// Export the wrapped handler with error handling
export const createChatMessage = withErrorHandling(
  createMessageHandler,
  createMessageResponseSchema,
  'createMessage'
); 
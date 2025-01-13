'use server';

import { listMessagesResponseSchema } from '@danky/schema';
import { webListMessagesSchema, type WebListMessagesParams } from '@/lib/validations/chat';
import { getMessages } from '@/lib/db/chat';
import { withUser } from '@/lib/session';
import { withErrorHandling } from '@/lib/errors';

// Export the request schema type for client usage
export type ListMessagesParams = WebListMessagesParams;

async function listMessagesHandler(input: string) {
  return withUser(async _user => {
    // Parse and validate input
    const params = JSON.parse(input);
    const validatedInput = webListMessagesSchema.parse(params);

    // Query messages from database
    const { messages, pagination } = await getMessages(validatedInput);

    // Transform messages to match our schema
    const transformedMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: [
        {
          type: 'text',
          content: msg.content,
        },
      ],
      sessionId: msg.sessionId,
      metadata: msg.metadata,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      deletedAt: msg.deletedAt,
    }));

    // Return success response
    return listMessagesResponseSchema.parse({
      success: true,
      data: {
        messages: transformedMessages,
        pagination,
      },
    });
  });
}

// Export the wrapped handler with error handling
export const listMessages = withErrorHandling(
  listMessagesHandler,
  listMessagesResponseSchema,
  'listMessages'
);

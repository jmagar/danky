'use server';

import { z } from 'zod';
import { createMessageRequestSchema, createMessageResponseSchema } from '@danky/schema';
import { createMessage } from '@/lib/db/chat';
import { withUser } from '@/lib/session';
import { withErrorHandling } from '@/lib/errors';

async function createMessageHandler(input: z.infer<typeof createMessageRequestSchema>) {
  return withUser(async user => {
    // Validate input
    const validatedInput = createMessageRequestSchema.parse(input);

    // Create message in database
    const result = await createMessage(validatedInput, user.id);

    // Return success response
    return createMessageResponseSchema.parse({
      success: true,
      data: result[0],
    });
  });
}

// Export the wrapped handler with error handling
export const createChatMessage = withErrorHandling(
  createMessageHandler,
  createMessageResponseSchema,
  'createMessage'
);

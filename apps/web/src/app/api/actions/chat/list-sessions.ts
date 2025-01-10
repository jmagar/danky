'use server';

import { z } from 'zod';
import { listSessionsRequestSchema, listSessionsResponseSchema } from '@danky/schema';
import { getSessions } from '@/lib/db/chat';
import { withUser } from '@/lib/session';
import { withErrorHandling } from '@/lib/errors';

async function listChatSessionsHandler(input: z.infer<typeof listSessionsRequestSchema>) {
  return withUser(async (user) => {
    // Validate input
    const validatedInput = listSessionsRequestSchema.parse(input);

    // Get sessions from database
    const { sessions, pagination } = await getSessions(validatedInput, user.id);

    // Transform sessions to match our schema
    const transformedSessions = sessions.map(session => ({
      id: session.id,
      name: session.title,
      modelId: session.modelId,
      description: session.description ?? undefined,
      metadata: session.metadata,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));

    // Return success response
    return listSessionsResponseSchema.parse({
      success: true,
      data: transformedSessions,
      pagination,
    });
  });
}

// Export the wrapped handler with error handling
export const listChatSessions = withErrorHandling(
  listChatSessionsHandler,
  listSessionsResponseSchema,
  'listChatSessions'
); 
'use server';

import { z } from 'zod';
import { updateSessionRequestSchema, updateSessionResponseSchema } from '@danky/schema';
import { updateSession } from '@/lib/db/chat';

export async function updateChatSession(input: z.infer<typeof updateSessionRequestSchema>) {
  try {
    // Validate input
    const validatedInput = updateSessionRequestSchema.parse(input);

    // TODO: Get actual user ID from session
    const userId = 'temp-user-id';

    // Update session in database
    const session = await updateSession(validatedInput, userId);

    if (!session) {
      return updateSessionResponseSchema.parse({
        success: false,
        error: 'Session not found or you do not have permission to update it',
      });
    }

    // Transform session to match our schema
    const transformedSession = {
      id: session.id,
      name: session.title,
      modelId: session.metadata?.modelId ?? 'default-model',
      description: session.metadata?.description,
      metadata: session.metadata,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };

    // Return success response
    return updateSessionResponseSchema.parse({
      success: true,
      data: transformedSession,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return updateSessionResponseSchema.parse({
        success: false,
        error: 'Invalid input: ' + error.errors.map(e => e.message).join(', '),
      });
    }

    // Handle other errors
    console.error('Error updating session:', error);
    return updateSessionResponseSchema.parse({
      success: false,
      error: 'Failed to update session',
    });
  }
} 
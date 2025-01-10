'use server';

import { z } from 'zod';
import { createSessionRequestSchema, createSessionResponseSchema } from '@danky/schema';
import { createSession } from '@/lib/db/chat';

export async function createChatSession(input: z.infer<typeof createSessionRequestSchema>) {
  try {
    // Validate input
    const validatedInput = createSessionRequestSchema.parse(input);

    // TODO: Get actual user ID from session
    const userId = 'temp-user-id';

    // Create session in database
    const session = await createSession(validatedInput, userId);

    // Transform session to match our schema
    const transformedSession = {
      id: session.id,
      name: session.title,
      modelId: input.modelId,
      metadata: session.metadata,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };

    // Return success response
    return createSessionResponseSchema.parse({
      success: true,
      data: transformedSession,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return createSessionResponseSchema.parse({
        success: false,
        error: 'Invalid input: ' + error.errors.map(e => e.message).join(', '),
      });
    }

    // Handle other errors
    console.error('Error creating session:', error);
    return createSessionResponseSchema.parse({
      success: false,
      error: 'Failed to create session',
    });
  }
} 
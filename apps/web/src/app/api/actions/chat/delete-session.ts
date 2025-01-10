'use server';

import { z } from 'zod';
import { deleteSessionRequestSchema, deleteSessionResponseSchema } from '@danky/schema';
import { deleteSession } from '@/lib/db/chat';

export async function deleteChatSession(input: z.infer<typeof deleteSessionRequestSchema>) {
  try {
    // Validate input
    const validatedInput = deleteSessionRequestSchema.parse(input);

    // TODO: Get actual user ID from session
    const userId = 'temp-user-id';

    // Delete session from database
    const session = await deleteSession(validatedInput, userId);

    if (!session) {
      return deleteSessionResponseSchema.parse({
        success: false,
        error: 'Session not found or you do not have permission to delete it',
      });
    }

    // Return success response
    return deleteSessionResponseSchema.parse({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return deleteSessionResponseSchema.parse({
        success: false,
        error: 'Invalid input: ' + error.errors.map(e => e.message).join(', '),
      });
    }

    // Handle other errors
    console.error('Error deleting session:', error);
    return deleteSessionResponseSchema.parse({
      success: false,
      error: 'Failed to delete session',
    });
  }
} 
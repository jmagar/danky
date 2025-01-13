import { createLogger } from '@danky/logger';
import { z } from 'zod';

const logger = createLogger('error-handler');

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class WebSocketError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'WEBSOCKET_ERROR', 500, details);
    this.name = 'WebSocketError';
  }
}

export class APIError extends AppError {
  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message, 'API_ERROR', statusCode, details);
    this.name = 'APIError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', details?: unknown) {
    super(message, 'UNAUTHORIZED', 401, details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', details?: unknown) {
    super(message, 'FORBIDDEN', 403, details);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not Found', details?: unknown) {
    super(message, 'NOT_FOUND', 404, details);
    this.name = 'NotFoundError';
  }
}

export function handleError(error: unknown): never {
  if (error instanceof AppError) {
    logger.error(
      {
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
      },
      error.message
    );
    throw error;
  }

  // Handle unknown errors
  logger.error({ error }, 'Unexpected error occurred');
  throw new AppError('An unexpected error occurred', 'UNKNOWN_ERROR');
}

export function withErrorHandling<TInput, TOutput>(
  handler: (input: TInput) => Promise<TOutput>,
  responseSchema: z.ZodType<TOutput>,
  operationName: string
): (input: TInput) => Promise<TOutput> {
  return async (input: TInput) => {
    try {
      const result = await handler(input);
      return responseSchema.parse(result);
    } catch (error) {
      logger.error({ error, input, operation: operationName }, 'Operation failed');

      if (error instanceof AppError) {
        // Return error response
        return responseSchema.parse({
          success: false,
          error: error.message,
        });
      }

      if (error instanceof z.ZodError) {
        // Return validation error response
        return responseSchema.parse({
          success: false,
          error: `Validation failed: ${error.errors.map(e => e.message).join(', ')}`,
        });
      }

      // Return generic error response
      return responseSchema.parse({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };
}

export function handleDatabaseError(error: unknown): never {
  if (error instanceof AppError) {
    throw error;
  }

  logger.error({ error }, 'Database error occurred');
  throw new AppError('A database error occurred', 'DATABASE_ERROR', 500);
}

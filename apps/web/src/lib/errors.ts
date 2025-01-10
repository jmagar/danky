import { z } from 'zod';
import { logger } from '@danky/logger';

// Error types
export class BaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, details?: z.ZodError) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super(message, 'FORBIDDEN', 403);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class RateLimitError extends BaseError {
  constructor(message: string, details?: { retryAfter?: number }) {
    super(message, 'RATE_LIMIT', 429, details);
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'DATABASE_ERROR', 500, details);
  }
}

export class TokenLimitError extends BaseError {
  constructor(message: string, details?: { limit: number; current: number }) {
    super(message, 'TOKEN_LIMIT', 400, details);
  }
}

export class BatchOperationError extends BaseError {
  constructor(message: string, details?: { errors: Array<{ id: string; error: string }> }) {
    super(message, 'BATCH_OPERATION_ERROR', 400, details);
  }
}

// Error handler wrapper
export function withErrorHandling<T extends z.ZodType>(
  handler: (...args: any[]) => Promise<z.infer<T>>,
  responseSchema: T,
  operationName: string
) {
  return async (...args: Parameters<typeof handler>): Promise<z.infer<T>> => {
    try {
      const result = await handler(...args);
      return responseSchema.parse(result);
    } catch (error) {
      logger.error({
        operation: operationName,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof BaseError ? error.details : undefined,
        args,
      });

      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid request data', error);
      }

      if (error instanceof BaseError) {
        throw error;
      }

      throw new BaseError(
        'An unexpected error occurred',
        'INTERNAL_SERVER_ERROR',
        500
      );
    }
  };
}

// Partial success handler for batch operations
export function handlePartialSuccess<T>(
  results: Array<{ success: boolean; error?: string; data?: T }>,
  operation: string
): {
  successful: T[];
  failed: Array<{ error: string }>;
} {
  const successful: T[] = [];
  const failed: Array<{ error: string }> = [];

  results.forEach((result) => {
    if (result.success && result.data) {
      successful.push(result.data);
    } else {
      failed.push({ error: result.error || `${operation} failed` });
    }
  });

  if (failed.length > 0 && successful.length === 0) {
    throw new BatchOperationError(`All ${operation} operations failed`, {
      errors: failed.map((f, i) => ({ id: String(i), error: f.error })),
    });
  }

  return { successful, failed };
}

// Rate limiting helper
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number = 60000
): void {
  const now = Date.now();
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= limit) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    throw new RateLimitError('Rate limit exceeded', { retryAfter });
  }

  current.count++;
}

// Token counting helper
export function checkTokenLimit(
  content: string,
  limit: number,
  current: number = 0
): void {
  // Simple approximation: 1 token ≈ 4 characters
  const estimatedTokens = Math.ceil(content.length / 4);
  
  if (current + estimatedTokens > limit) {
    throw new TokenLimitError('Token limit exceeded', {
      limit,
      current: current + estimatedTokens,
    });
  }
}

// Database error handler
export function handleDatabaseError(error: unknown): never {
  if (error instanceof Error) {
    // Handle specific database errors
    if (error.message.includes('duplicate key')) {
      throw new ValidationError('Duplicate record');
    }
    if (error.message.includes('foreign key')) {
      throw new ValidationError('Invalid reference');
    }
    throw new DatabaseError('Database operation failed', error);
  }
  throw new DatabaseError('Unknown database error');
} 
import { db } from '@danky/db';
import { handleDatabaseError } from '../errors';
import { logger } from '@danky/logger';

// Transaction options type
interface TransactionOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

// Default options
const DEFAULT_OPTIONS: Required<TransactionOptions> = {
  maxRetries: 3,
  retryDelay: 100,
  timeout: 30000,
};

// Helper to wait between retries
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to check if error is retryable
function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  
  const message = error.message.toLowerCase();
  return (
    message.includes('deadlock') ||
    message.includes('lock timeout') ||
    message.includes('serialization') ||
    message.includes('too many connections') ||
    message.includes('connection terminated')
  );
}

// Generic transaction executor with retries
async function executeTransaction<T>(
  operation: (tx: typeof db) => Promise<T>,
  options: TransactionOptions = {}
): Promise<T> {
  const { maxRetries, retryDelay, timeout } = { ...DEFAULT_OPTIONS, ...options };
  let attempt = 0;
  
  while (true) {
    attempt++;
    
    try {
      // Start transaction with timeout
      const result = await Promise.race([
        db.transaction(async (tx) => {
          return operation(tx);
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction timeout')), timeout)
        ),
      ]);
      
      return result as T;
    } catch (error) {
      logger.error({
        operation: 'transaction',
        attempt,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      if (attempt >= maxRetries || !isRetryableError(error)) {
        return handleDatabaseError(error);
      }
      
      // Wait before retrying
      await wait(retryDelay * attempt);
    }
  }
}

// Read-only transaction wrapper
export async function withReadOnlyTransaction<T>(
  operation: (tx: typeof db) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  return executeTransaction(async (tx) => {
    // Set transaction to read only
    await tx.execute({ sql: 'SET TRANSACTION READ ONLY' });
    return operation(tx);
  }, options);
}

// Write transaction wrapper
export async function withWriteTransaction<T>(
  operation: (tx: typeof db) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  return executeTransaction(async (tx) => {
    // Set transaction isolation level
    await tx.execute({ sql: 'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE' });
    return operation(tx);
  }, options);
}

// Batch operation wrapper
export async function withBatchTransaction<T>(
  operations: Array<(tx: typeof db) => Promise<T>>,
  options?: TransactionOptions
): Promise<T[]> {
  return executeTransaction(async (tx) => {
    const results: T[] = [];
    const errors: Error[] = [];
    
    for (const operation of operations) {
      try {
        const result = await operation(tx);
        results.push(result);
      } catch (error) {
        errors.push(error as Error);
        // Don't break the transaction for partial failures
        logger.error({
          operation: 'batchOperation',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    // If all operations failed, throw error
    if (errors.length === operations.length) {
      throw new Error('All batch operations failed');
    }
    
    return results;
  }, options);
}

// Connection pool management
let poolSize = 10;

export function setPoolSize(size: number): void {
  poolSize = size;
  // Update pool size in database configuration
  db.execute({ sql: `SET max_connections = ${size}` });
}

export function getPoolSize(): number {
  return poolSize;
}

// Export transaction types
export type Transaction = typeof db;
export type TransactionClient = Awaited<ReturnType<typeof db.transaction>>; 
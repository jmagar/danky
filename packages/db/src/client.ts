import { drizzle } from 'drizzle-orm/node-postgres';
import { type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from './env';

// Configure connection pool with PgBouncer settings
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20, // Match PGBOUNCER_DEFAULT_POOL_SIZE
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 60000,
  query_timeout: 60000,
});

export const db = drizzle(pool, {
  logger: env.NODE_ENV === 'development',
});

// Export type for the database client
export type DrizzleClient = typeof db;

// Export a type-safe transaction helper
export async function transaction<T>(callback: (db: DrizzleClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(drizzle(client));
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

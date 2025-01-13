import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { env } from './env';
import { createLogger } from '@danky/logger';

const logger = createLogger('db-migrate');

async function runMigrations() {
  logger.info('Starting database migrations...');

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  try {
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: './src/migrations' });
    logger.info('Migrations completed successfully');
  } catch (error) {
    logger.error({ error }, 'Migration failed');
    throw error;
  } finally {
    await pool.end();
  }
}

runMigrations().catch(error => {
  logger.error({ error }, 'Migration script failed');
  process.exit(1);
});

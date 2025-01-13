import type { Config } from 'drizzle-kit';
import { env } from './src/env';

export default {
  schema: './src/schema/*',
  out: './src/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;

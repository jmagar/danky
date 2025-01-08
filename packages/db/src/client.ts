import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { createLogger } from "@danky/logger";
import * as schema from "./schema";

const logger = createLogger("db");

// Load environment variables
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Configure connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // PgBouncer settings
  statement_timeout: 60000, // 1 minute
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Add error handler
pool.on("error", (err) => {
  logger.error({ err }, "Unexpected error on idle client");
  process.exit(-1);
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Export pool for direct usage if needed
export { pool }; 
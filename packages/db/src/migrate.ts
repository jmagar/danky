import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
const envPath = resolve(__dirname, "../../../.env");
console.log("Loading environment variables from:", envPath);
dotenv.config({ path: envPath });

// Construct the DATABASE_URL manually
const {
  POSTGRES_USER = "danky",
  POSTGRES_PASSWORD = "danky",
  POSTGRES_DB = "danky",
  POSTGRES_PORT = "5432",
} = process.env;

const DATABASE_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}`;

console.log("Environment variables:", {
  DATABASE_URL,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
});

const runMigrations = async () => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL could not be constructed");
  }

  const sql = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(sql);

  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  } finally {
    await sql.end();
  }
};

runMigrations().catch((error) => {
  console.error("Migration script failed:", error);
  process.exit(1);
}); 
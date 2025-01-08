import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import { createLogger } from "@danky/logger";
import { users, sessions, conversations, messages } from "./schema";
import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: resolve(__dirname, "../../../.env") });

const logger = createLogger("db:seed");

// Construct the DATABASE_URL manually
const {
  POSTGRES_USER = "danky",
  POSTGRES_PASSWORD = "danky",
  POSTGRES_DB = "danky",
  POSTGRES_PORT = "5432",
} = process.env;

const DATABASE_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}`;

logger.info("Environment variables:", {
  DATABASE_URL,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
});

// Create a new pool for seeding
const pool = new Pool({
  connectionString: DATABASE_URL,
});

const db = drizzle(pool);

// Seed data
async function main() {
  logger.info("Seeding database...");
  
  try {
    // Create test user
    const [user] = await db.insert(users).values({
      id: randomUUID(),
      email: "test@example.com",
      hashedPassword: "hashed_password_here", // In production, use proper password hashing
      fullName: "Test User",
      isActive: true,
      isVerified: true,
    }).returning();

    logger.info({ userId: user.id }, "Created test user");

    // Create test conversation
    const [conversation] = await db.insert(conversations).values({
      id: randomUUID(),
      userId: user.id,
      title: "Test Conversation",
    }).returning();

    logger.info({ conversationId: conversation.id }, "Created test conversation");

    // Create test messages
    await db.insert(messages).values([
      {
        id: randomUUID(),
        conversationId: conversation.id,
        role: "user",
        content: "Hello, AI!",
      },
      {
        id: randomUUID(),
        conversationId: conversation.id,
        role: "assistant",
        content: "Hello! How can I help you today?",
      },
    ]);

    logger.info("Created test messages");
    logger.info("Seeding completed successfully");
  } catch (error) {
    logger.error({ error }, "Seeding failed");
    process.exit(1);
  }

  await pool.end();
}

main(); 
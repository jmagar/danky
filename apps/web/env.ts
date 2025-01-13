import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // Qdrant
  QDRANT_URL: z.string().url(),

  // API Keys
  OPENAI_API_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  GROQ_API_KEY: z.string().optional(),
  BRAVE_API_KEY: z.string().optional(),

  // Environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

// Validate and export environment
export const env = envSchema.parse(process.env);

// Export type
export type Env = z.infer<typeof envSchema>;

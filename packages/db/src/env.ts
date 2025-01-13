import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

// Validate and export environment
export const env = envSchema.parse(process.env);

// Export type
export type Env = z.infer<typeof envSchema>;

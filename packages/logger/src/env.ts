import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

// Validate and export environment
export const env = envSchema.parse(process.env);

// Export type
export type Env = z.infer<typeof envSchema>;

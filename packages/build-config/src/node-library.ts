import { type Options } from 'tsup';
import { z } from 'zod';
import { baseConfig, baseOptionsSchema } from './base';

const EXTERNAL_DEPS = ['@danky/*', 'zod', 'drizzle-orm', 'drizzle-zod', '@trpc/*'] as const;

export const nodeLibraryOptionsSchema = baseOptionsSchema.extend({
  platform: z.enum(['node', 'neutral']).optional().default('node'),
  target: z.enum(['node20', 'node18', 'node16']).optional().default('node18'),
  shims: z.boolean().optional().default(true),
});

export type NodeLibraryOptions = z.infer<typeof nodeLibraryOptionsSchema>;

export const nodeLibraryConfig = (options: Partial<NodeLibraryOptions> = {}) => {
  const validatedOptions = nodeLibraryOptionsSchema.parse({
    ...options,
    external: [...EXTERNAL_DEPS, ...(options.external || [])],
  });

  return baseConfig({
    ...validatedOptions,
    format: ['esm'],
  });
};

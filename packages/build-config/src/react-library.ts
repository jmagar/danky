import { type Options } from 'tsup';
import { z } from 'zod';
import { baseConfig, baseOptionsSchema } from './base';

const EXTERNAL_DEPS = [
  'react',
  'react-dom',
  '@radix-ui/*',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  '@danky/*',
] as const;

export const reactLibraryOptionsSchema = baseOptionsSchema.extend({
  platform: z.enum(['browser', 'node', 'neutral']).optional().default('browser'),
  target: z.enum(['es2022', 'es2020', 'es2019', 'es2018', 'es2017']).optional().default('es2022'),
});

export type ReactLibraryOptions = z.infer<typeof reactLibraryOptionsSchema>;

export const reactLibraryConfig = (options: Partial<ReactLibraryOptions> = {}) => {
  const validatedOptions = reactLibraryOptionsSchema.parse({
    ...options,
    external: [...EXTERNAL_DEPS, ...(options.external || [])],
  });

  return baseConfig({
    ...validatedOptions,
    format: ['esm'],
  });
};

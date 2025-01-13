import { defineConfig, type Options } from 'tsup';
import { z } from 'zod';

export const baseOptionsSchema = z.object({
  entry: z.array(z.string()).optional().default(['src/index.ts']),
  format: z
    .array(z.enum(['esm', 'cjs', 'iife']))
    .optional()
    .default(['esm']),
  external: z.array(z.string()).optional().default([]),
  dts: z.boolean().optional().default(true),
  sourcemap: z.boolean().optional().default(true),
  clean: z.boolean().optional().default(true),
});

export type BaseOptions = z.infer<typeof baseOptionsSchema>;

export const baseConfig = (options: Partial<BaseOptions> = {}) => {
  const validatedOptions = baseOptionsSchema.parse(options);
  return defineConfig({
    ...validatedOptions,
    dts: true,
    sourcemap: true,
    clean: true,
  });
};

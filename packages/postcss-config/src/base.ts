import type { AcceptedPlugin } from 'postcss';
import { z } from 'zod';

export const postCSSPluginSchema = z.record(z.string(), z.any());

export const postCSSConfigSchema = z.object({
  plugins: postCSSPluginSchema,
});

export type PostCSSConfig = z.infer<typeof postCSSConfigSchema>;

export const baseConfig = postCSSConfigSchema.parse({
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
      },
    },
  },
});

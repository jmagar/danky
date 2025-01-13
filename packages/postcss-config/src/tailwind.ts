import { z } from 'zod';
import { baseConfig, postCSSConfigSchema } from './base';

export const tailwindConfigSchema = postCSSConfigSchema.extend({});

export type TailwindConfig = z.infer<typeof tailwindConfigSchema>;

export const tailwindConfig = tailwindConfigSchema.parse({
  ...baseConfig,
  plugins: {
    ...baseConfig.plugins,
    tailwindcss: {},
    autoprefixer: {},
  },
});

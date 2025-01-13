import type { Config } from 'tailwindcss';
import { z } from 'zod';
import { baseConfig, baseConfigSchema } from './base';

export const componentsConfigSchema = baseConfigSchema.extend({
  content: z.array(z.string()).default(['./src/**/*.{ts,tsx}']),
  plugins: z.array(z.any()).default([require('tailwindcss-animate')]),
});

export type ComponentsConfig = z.infer<typeof componentsConfigSchema>;

export const componentsConfig: Partial<Config> = componentsConfigSchema.parse({
  ...baseConfig,
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [require('tailwindcss-animate')],
});

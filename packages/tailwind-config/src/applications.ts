import type { Config } from 'tailwindcss';
import { z } from 'zod';
import { baseConfig, baseConfigSchema } from './base';

export const applicationsConfigSchema = baseConfigSchema.extend({
  content: z
    .array(z.string())
    .default(['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}']),
  plugins: z
    .array(z.any())
    .default([require('tailwindcss-animate'), require('@tailwindcss/typography')]),
});

export type ApplicationsConfig = z.infer<typeof applicationsConfigSchema>;

export const applicationsConfig: Partial<Config> = applicationsConfigSchema.parse({
  ...baseConfig,
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
});

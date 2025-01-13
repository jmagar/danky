import type { Config } from 'tailwindcss';
import { z } from 'zod';

const colorSchema = z.object({
  DEFAULT: z.string(),
  foreground: z.string().optional(),
});

export const baseConfigSchema = z.object({
  darkMode: z
    .tuple([z.literal('class')])
    .optional()
    .default(['class']),
  content: z.array(z.string()).optional().default([]),
  theme: z.object({
    container: z.object({
      center: z.boolean(),
      padding: z.string(),
      screens: z.record(z.string(), z.string()),
    }),
    extend: z.object({
      colors: z.object({
        border: z.string(),
        input: z.string(),
        ring: z.string(),
        background: z.string(),
        foreground: z.string(),
        primary: colorSchema,
        secondary: colorSchema,
        destructive: colorSchema,
        muted: colorSchema,
        accent: colorSchema,
        popover: colorSchema,
        card: colorSchema,
      }),
      borderRadius: z.object({
        lg: z.string(),
        md: z.string(),
        sm: z.string(),
      }),
      keyframes: z.record(z.string(), z.record(z.string(), z.record(z.string(), z.string()))),
      animation: z.record(z.string(), z.string()),
    }),
  }),
});

export type BaseConfig = z.infer<typeof baseConfigSchema>;

export const baseConfig: Partial<Config> = baseConfigSchema.parse({
  darkMode: ['class'],
  content: [],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
      },
    },
  },
});

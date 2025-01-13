import type { NextConfig } from 'next';
import { z } from 'zod';
import { webpackConfig } from './webpack';

export const baseConfigSchema = z.object({
  reactStrictMode: z.boolean().default(true),
  transpilePackages: z
    .array(z.string())
    .default(['@danky/ui', '@danky/logger', '@danky/db', '@danky/redis', '@danky/schema']),
  experimental: z
    .object({
      serverActions: z.object({
        allowedOrigins: z.array(z.string()),
      }),
      typedRoutes: z.boolean(),
    })
    .default({
      serverActions: {
        allowedOrigins: ['localhost:3000'],
      },
      typedRoutes: true,
    }),
  webpack: z.function().default(() => webpackConfig),
});

export type BaseConfig = z.infer<typeof baseConfigSchema>;

export const baseConfig: NextConfig = baseConfigSchema.parse({
  reactStrictMode: true,
  transpilePackages: ['@danky/ui', '@danky/logger', '@danky/db', '@danky/redis', '@danky/schema'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    typedRoutes: true,
  },
  webpack: webpackConfig,
});

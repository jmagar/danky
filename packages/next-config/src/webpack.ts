import type { Configuration } from 'webpack';
import { z } from 'zod';

export const webpackConfigSchema = z
  .function()
  .args(z.custom<Configuration>())
  .returns(z.custom<Configuration>());

export type WebpackConfigFn = z.infer<typeof webpackConfigSchema>;

export const webpackConfig = webpackConfigSchema.parse((config: Configuration): Configuration => {
  // Polyfill node modules
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    },
  };

  // Add source maps
  config.module = {
    ...config.module,
    rules: [
      ...(config.module?.rules || []),
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  };

  return config;
});

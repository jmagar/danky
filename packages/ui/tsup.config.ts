import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@radix-ui/*',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
  ],
});

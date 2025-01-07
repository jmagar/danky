import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  external: [
    'react',
    'react-dom',
    '@radix-ui/*',
    'cmdk',
    'react-day-picker',
    'recharts',
    'next-themes',
    'sonner',
    'lucide-react'
  ],
  treeshake: true,
  sourcemap: true,
}) 
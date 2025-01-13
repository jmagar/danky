# Configuration Standardization Guide

This document outlines the standardization of configurations across the Danky monorepo. Each section details a specific configuration type, its purpose, and implementation details.

## Build Configuration (@danky/build-config)

### Purpose

Standardize build configurations across all packages using tsup, ensuring consistent output formats, type generation, and external dependency handling.

### Implementation Details

1. **Package Structure**

   ```
   packages/build-config/
   ├── package.json
   ├── tsconfig.json
   ├── src/
   │   ├── index.ts
   │   ├── base.ts
   │   ├── react-library.ts
   │   └── node-library.ts
   ```

2. **Base Configuration (`base.ts`)**

   ```typescript
   import { Options } from 'tsup';

   export interface BaseConfig extends Options {
     entry: string[];
     format: ['esm'];
     dts: true;
     sourcemap: true;
     clean: true;
   }

   export const baseConfig: BaseConfig = {
     entry: ['src/index.ts'],
     format: ['esm'],
     dts: true,
     sourcemap: true,
     clean: true,
   };
   ```

3. **React Library Configuration (`react-library.ts`)**

   ```typescript
   import { Options } from 'tsup';
   import { baseConfig } from './base';

   export const reactLibraryConfig: Options = {
     ...baseConfig,
     external: [
       'react',
       'react-dom',
       '@radix-ui/*',
       'class-variance-authority',
       'clsx',
       'tailwind-merge',
     ],
   };
   ```

4. **Node Library Configuration (`node-library.ts`)**

   ```typescript
   import { Options } from 'tsup';
   import { baseConfig } from './base';

   export const nodeLibraryConfig: Options = {
     ...baseConfig,
     platform: 'node',
     target: 'node18',
   };
   ```

5. **Usage in Packages**

   ```typescript
   // Example tsup.config.ts in a React library package
   import { reactLibraryConfig } from '@danky/build-config/react-library';
   import { defineConfig } from 'tsup';

   export default defineConfig({
     ...reactLibraryConfig,
     // Package-specific overrides here
   });
   ```

## Styling Configuration (@danky/tailwind-config)

### Purpose

Standardize Tailwind CSS configurations across the UI package and web applications, ensuring consistent theming, animations, and utility classes.

### Implementation Details

1. **Package Structure**

   ```
   packages/tailwind-config/
   ├── package.json
   ├── src/
   │   ├── index.ts
   │   ├── base.ts
   │   ├── components.ts
   │   └── applications.ts
   ```

2. **Base Configuration (`base.ts`)**

   ```typescript
   import type { Config } from 'tailwindcss';

   export const baseConfig: Partial<Config> = {
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
           // ... other color definitions
         },
         borderRadius: {
           lg: 'var(--radius)',
           md: 'calc(var(--radius) - 2px)',
           sm: 'calc(var(--radius) - 4px)',
         },
         keyframes: {
           // ... keyframe definitions
         },
         animation: {
           // ... animation definitions
         },
       },
     },
   };
   ```

3. **Components Configuration (`components.ts`)**

   ```typescript
   import { baseConfig } from './base';
   import type { Config } from 'tailwindcss';

   export const componentsConfig: Partial<Config> = {
     ...baseConfig,
     content: ['./src/**/*.{ts,tsx}'],
     plugins: [require('tailwindcss-animate')],
   };
   ```

4. **Applications Configuration (`applications.ts`)**

   ```typescript
   import { baseConfig } from './base';
   import type { Config } from 'tailwindcss';

   export const applicationsConfig: Partial<Config> = {
     ...baseConfig,
     content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
     plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
   };
   ```

5. **Usage in Packages/Apps**

   ```javascript
   // Example tailwind.config.js in UI package
   import { componentsConfig } from '@danky/tailwind-config/components';

   export default {
     ...componentsConfig,
     // Package-specific overrides here
   };
   ```

## Next.js Configuration (@danky/next-config)

### Purpose

Standardize Next.js configurations across web applications, ensuring consistent module resolution, transpilation, and optimization settings.

### Implementation Details

1. **Package Structure**

   ```
   packages/next-config/
   ├── package.json
   ├── src/
   │   ├── index.ts
   │   ├── base.ts
   │   └── webpack.ts
   ```

2. **Base Configuration (`base.ts`)**

   ```typescript
   import type { NextConfig } from 'next';
   import { webpackConfig } from './webpack';

   export const baseConfig: NextConfig = {
     reactStrictMode: true,
     transpilePackages: [
       '@danky/ui',
       '@danky/logger',
       '@danky/db',
       '@danky/redis',
       '@danky/schema',
     ],
     experimental: {
       serverActions: true,
     },
     webpack: webpackConfig,
   };
   ```

3. **Webpack Configuration (`webpack.ts`)**

   ```typescript
   import type { Configuration } from 'webpack';

   export function webpackConfig(config: Configuration) {
     // Polyfill node modules
     config.resolve.fallback = {
       ...config.resolve.fallback,
       fs: false,
       net: false,
       tls: false,
       crypto: false,
     };

     // Add source maps
     config.module.rules.push({
       test: /\.js$/,
       enforce: 'pre',
       use: ['source-map-loader'],
     });

     return config;
   }
   ```

4. **Usage in Applications**

   ```typescript
   // Example next.config.js
   import { baseConfig } from '@danky/next-config';

   export default {
     ...baseConfig,
     // App-specific overrides here
   };
   ```

## PostCSS Configuration (@danky/postcss-config)

### Purpose

Standardize PostCSS configurations across packages and applications, ensuring consistent CSS processing and optimization.

### Implementation Details

1. **Package Structure**

   ```
   packages/postcss-config/
   ├── package.json
   ├── src/
   │   ├── index.ts
   │   ├── base.ts
   │   └── tailwind.ts
   ```

2. **Base Configuration (`base.ts`)**

   ```typescript
   export const baseConfig = {
     plugins: {
       'postcss-import': {},
       'postcss-preset-env': {
         stage: 3,
         features: {
           'nesting-rules': true,
         },
       },
     },
   };
   ```

3. **Tailwind Configuration (`tailwind.ts`)**

   ```typescript
   import { baseConfig } from './base';

   export const tailwindConfig = {
     ...baseConfig,
     plugins: {
       ...baseConfig.plugins,
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

4. **Usage in Packages/Apps**

   ```javascript
   // Example postcss.config.js
   import { tailwindConfig } from '@danky/postcss-config/tailwind';

   export default tailwindConfig;
   ```

## Implementation Steps

1. Create each configuration package with proper `package.json` setup
2. Implement base configurations and specialized variants
3. Update all packages to use the standardized configurations
4. Add documentation for each configuration package
5. Set up proper exports and types
6. Add validation for configuration overrides
7. Implement CI checks for configuration consistency

## Migration Guide

1. **For Build Configuration**

   - Replace individual tsup configs with standardized ones
   - Update package.json build scripts if needed
   - Test builds across all packages

2. **For Styling Configuration**

   - Move existing theme variables to shared config
   - Update content paths in Tailwind configs
   - Test styling consistency across components

3. **For Next.js Configuration**

   - Replace app-specific Next.js configs
   - Test webpack configurations
   - Verify module resolution and transpilation

4. **For PostCSS Configuration**
   - Replace individual PostCSS configs
   - Test CSS processing and optimization
   - Verify Tailwind integration

## Maintenance Guidelines

1. **Adding New Configurations**

   - Create new configuration variant in appropriate package
   - Document usage and options
   - Update tests and validation

2. **Updating Existing Configurations**

   - Follow semantic versioning
   - Document breaking changes
   - Update all dependent packages

3. **Configuration Validation**
   - Add runtime validation using Zod
   - Implement CI checks for config consistency
   - Add type checking for configuration overrides

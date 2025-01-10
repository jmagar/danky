# @danky/ui

Shared UI components for the Danky AI Chatbot platform, built with shadcn/ui and Tailwind CSS.

## Overview

The UI package provides a collection of reusable, accessible, and customizable components that follow our design system. It's built on top of shadcn/ui and uses Tailwind CSS for styling.

## Directory Structure

```
src/
├── components/       # UI components
│   ├── ui/          # Base components (shadcn)
│   └── custom/      # Custom components
├── hooks/           # Shared hooks
├── styles/          # Global styles
│   └── globals.css  # Global CSS
├── lib/             # Utilities
│   └── utils.ts     # Helper functions
└── types/           # TypeScript types
```

## Key Features

- **Accessibility**: ARIA compliant components
- **Theme Support**: Dark/light mode
- **Type Safety**: Full TypeScript coverage
- **Customization**: Tailwind CSS + CSS variables
- **Documentation**: Component stories
- **Testing**: Unit and integration tests

## Usage

### Installation

```bash
pnpm add @danky/ui
```

### Basic Usage

```typescript
import { Button } from '@danky/ui'

export function MyComponent() {
  return (
    <Button variant="primary">
      Click me
    </Button>
  )
}
```

### Theme Setup

```typescript
import '@danky/ui/styles/globals.css'

export function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  )
}
```

## AI Development Notes

### Key Concepts

1. **Component Architecture**
   - Base components from shadcn/ui
   - Custom components extend base
   - Composition over inheritance
   - Props for customization

2. **Styling System**
   - Tailwind CSS classes
   - CSS variables for theming
   - Component variants
   - Responsive design

3. **Type System**
   - Props interfaces
   - Variant types
   - Event handlers
   - Ref forwarding

### Common Patterns

#### Component Structure
```typescript
import * as React from 'react'
import { cn } from '../lib/utils'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'primary'
}

export const Component = React.forwardRef<HTMLDivElement, Props>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-styles',
          variant === 'primary' && 'primary-styles',
          className
        )}
        {...props}
      />
    )
  }
)
Component.displayName = 'Component'
```

#### Hook Pattern
```typescript
import { useState, useCallback } from 'react'

export function useComponent() {
  const [state, setState] = useState(false)

  const toggle = useCallback(() => {
    setState(prev => !prev)
  }, [])

  return { state, toggle }
}
```

#### Theme Variants
```typescript
import { cva } from 'class-variance-authority'

export const componentVariants = cva(
  'base-styles',
  {
    variants: {
      variant: {
        default: 'default-styles',
        primary: 'primary-styles',
      },
      size: {
        sm: 'small-styles',
        md: 'medium-styles',
        lg: 'large-styles',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)
```

## Component Library

### Base Components
- Button
- Input
- Select
- Checkbox
- Radio
- Switch
- Textarea
- Dialog
- Popover
- Tooltip
- Tabs
- Card
- Badge

### Custom Components
- MessageInput
- LoadingSpinner
- ThemeToggle
- ErrorBoundary
- CodeBlock
- IconButton

## Development

### Adding New Components

1. Use shadcn CLI:
```bash
pnpm dlx shadcn@latest add [component-name]
```

2. Create wrapper (if needed):
```typescript
// src/components/custom/my-component.tsx
import { Button } from '../ui/button'

export function MyComponent() {
  return <Button>Custom Button</Button>
}
```

### Testing
```bash
pnpm test
pnpm test:watch
```

### Storybook
```bash
pnpm storybook
pnpm build-storybook
```

### Linting
```bash
pnpm lint
pnpm type-check
```

## Troubleshooting

### Common Issues
1. **Style Conflicts**: Check Tailwind class order
2. **Type Errors**: Verify prop types
3. **Theme Issues**: Check CSS variables
4. **Build Errors**: Check dependencies

### Debug Tools
- React DevTools
- Tailwind CSS Inspector
- Chrome DevTools
- Storybook

## Additional Resources

- [Component Documentation](../../docs/COMPONENTS.md)
- [Design System Guide](../../docs/DESIGN_SYSTEM.md)
- [Theme Customization](../../docs/THEMING.md)
- [Accessibility Guide](../../docs/ACCESSIBILITY.md)

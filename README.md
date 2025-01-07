# Danky AI Chatbot

A modern, extensible AI chatbot platform built with TypeScript, Next.js, and the Model Context Protocol (MCP).

## Overview

Danky is a sophisticated AI chatbot platform that leverages the power of various language models (OpenAI, Anthropic, Groq) through a unified interface. It features a modern web interface built with Next.js and shadcn/ui components, while utilizing the Model Context Protocol (MCP) for robust AI model integration.

## Features

- 🤖 Multi-model support (OpenAI, Anthropic, Groq)
- 🎨 Modern UI with shadcn/ui components
- 🔄 Real-time chat interactions
- 📁 File system integration
- 🛠️ Extensible tool system
- 🔒 Secure credential management
- 📊 Built-in logging and monitoring
- 🌙 Dark/Light mode support

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: Zustand
- **AI Integration**: Model Context Protocol (MCP)
- **Package Management**: pnpm
- **Development Tools**: ESLint, Prettier, TypeScript

## Project Structure

```
.
├── apps/
│   ├── web/               # Main web application
│   ├── bot/              # MCP bot implementation
│   └── docs/             # Documentation site
├── packages/
│   ├── ui/               # Shared UI components
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── typescript-config/ # Shared TypeScript configuration
│   └── types/            # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 20.11.0 or higher
- pnpm 8.x or higher
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jmagar/danky.git
   cd danky
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy the environment template and configure your environment variables:
   ```bash
   cp .env.template .env
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

### Environment Variables

Required environment variables:

- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `GROQ_API_KEY`: Groq API key

Optional environment variables:
- `BRAVE_API_KEY`: Brave Search API key

## Development

### Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks
- `pnpm test` - Run tests

### Adding New Components

1. Use the shadcn CLI to add new components:
   ```bash
   pnpm dlx shadcn@latest add [component-name]
   ```

2. Create wrapper components for customizations in `packages/ui/src/components/`

### Code Style

- Follow the TypeScript guidelines in `.cursorrules`
- Keep components focused and small
- Use Server Components by default
- Add 'use client' only when necessary
- Follow the monorepo package boundaries

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io)
- [shadcn/ui](https://ui.shadcn.com)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com) 
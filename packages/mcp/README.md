# Model Context Protocol (MCP) Implementation

## Overview

The Model Context Protocol (MCP) is a standardized interface that enables applications to provide context for LLMs in a standardized way, separating the concerns of providing context from the actual LLM interaction.

## Architecture

MCP follows a client-host-server architecture where each host can run multiple client instances:

```
┌─────────────────────────────────────┐
│          Application Host           │
│ ┌─────────┐                        │
│ │  Host   │                        │
│ │ ┌─────┐ ┌─────┐ ┌─────┐         │
│ │ │ C1  │ │ C2  │ │ C3  │         │
│ │ └─────┘ └─────┘ └─────┘         │
│ └─────────┘                        │
└─────────────────────────────────────┘
           │     │     │
           ▼     ▼     ▼
    ┌─────┐ ┌─────┐ ┌─────┐
    │ S1  │ │ S2  │ │ S3  │
    └─────┘ └─────┘ └─────┘
    Files   Database  APIs
```

### Core Components

- **Host**: Creates and manages multiple client instances, controls permissions, enforces security policies
- **Clients**: Maintain 1:1 connections with servers, handle protocol negotiation
- **Servers**: Provide specialized context and capabilities through resources, tools, and prompts

## Protocol Features

### Base Protocol
- JSON-RPC 2.0 message format
- Stateful connections
- Server and client capability negotiation
- Bidirectional communication

### Message Types
1. **Requests**: Bidirectional messages with method and parameters expecting a response
2. **Responses**: Successful results or errors matching specific request IDs
3. **Notifications**: One-way messages requiring no response

### Transport Layer

MCP defines two standard transport mechanisms:

#### stdio Transport
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

const server = new Server(
  {
    name: "example-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
```

#### HTTP with Server-Sent Events (SSE)
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"

const transport = new SSEServerTransport("/message", res)
const server = new Server(
  {
    name: "example-server",
    version: "0.1.0",
  },
  {
    capabilities: {},
  }
)

await server.connect(transport)
```

## Core Capabilities

### Resources
Resources represent data that can be accessed by AI models:

```typescript
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [{
      uri: `resource://example/1`,
      mimeType: "text/plain",
      name: "Example Resource",
      description: "A text resource"
    }]
  }
})
```

### Tools
Tools enable LLMs to perform actions through your server:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "example_tool": {
      const title = String(request.params.arguments?.title)
      const content = String(request.params.arguments?.content)

      return {
        content: [{
          type: "text",
          text: `Operation completed`
        }]
      }
    }
    default:
      throw new Error("Unknown tool")
  }
})
```

### Prompts
Prompts define structured interactions with AI models:

```typescript
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "example_prompt",
        description: "Example prompt",
      }
    ]
  }
})
```

## LangChain Integration

MCP tools can be integrated with LangChain using the `@h1deya/mcp-langchain-tools` package:

```typescript
import { convertMCPServersToLangChainTools } from '@h1deya/mcp-langchain-tools'

const mcpServers = {
  filesystem: {
    command: 'npx',
    args: [
      '-y',
      '@modelcontextprotocol/server-filesystem',
      '/path/to/directory'
    ]
  }
}

const { tools, cleanup } = await convertMCPServersToLangChainTools(mcpServers)
```

Currently supports OpenAI, Anthropic, and Groq LLMs.

### Current Limitations
- Only text-based tool results are supported

## Development

### Setup
```bash
npm install
npm run build
```

## Design Principles

1. **Servers should be extremely easy to build**
   - Host applications handle complex orchestration
   - Servers focus on specific, well-defined capabilities
   - Simple interfaces minimize implementation overhead

2. **Servers should be highly composable**
   - Each server provides focused functionality
   - Multiple servers can be combined seamlessly
   - Shared protocol enables interoperability

3. **Servers maintain isolation**
   - Servers receive only necessary contextual information
   - Full conversation history stays with the host
   - Each server connection maintains isolation
   - Cross-server interactions are controlled by the host

4. **Progressive feature adoption**
   - Core protocol provides minimal required functionality
   - Additional capabilities can be negotiated as needed
   - Servers and clients evolve independently
   - Backwards compatibility is maintained

## Additional Resources

- [Model Context Protocol](https://modelcontextprotocol.io) - Official documentation
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP LangChain Tools](https://github.com/hideya/mcp-langchain-tools-ts)

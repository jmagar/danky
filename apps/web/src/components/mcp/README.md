# MCP Components

React components for Model Context Protocol (MCP) integration in the Danky AI Chatbot platform.

## Overview

The MCP components handle the integration between the chat interface and the Model Context Protocol, managing tool execution, model responses, and AI interactions.

## Components

### Core Components
- `MCPProvider`: MCP context provider
- `MCPPanel`: Tool execution panel
- `ToolList`: Available tools list
- `ToolCard`: Individual tool component
- `ModelSelector`: AI model selection

### Supporting Components
- `ToolResults`: Tool execution results
- `ModelConfig`: Model configuration
- `ExecutionStatus`: Tool status display
- `ErrorDisplay`: Error handling UI
- `LoadingState`: Loading indicators

## State Management

### MCP Store
```typescript
interface MCPState {
  tools: Tool[]
  selectedModel: Model
  currentExecution: Execution | null
  history: ExecutionHistory[]
  error: Error | null
}
```

### Actions
- `executeTool`: Run selected tool
- `selectModel`: Change AI model
- `cancelExecution`: Stop current execution
- `clearHistory`: Clear execution history
- `updateConfig`: Update model config

## AI Development Notes

### Key Concepts

1. **Tool Execution**
   - Tool registration
   - Parameter validation
   - Result handling
   - Error recovery

2. **Model Management**
   - Model selection
   - Configuration
   - Token counting
   - Rate limiting

3. **State Handling**
   - Execution state
   - History tracking
   - Error handling
   - Recovery flows

### Common Patterns

#### Tool Registration
```tsx
function ToolRegistration() {
  const registerTool = useStore(state => state.registerTool)

  const handleRegister = async (tool: Tool) => {
    try {
      await registerTool(tool)
    } catch (error) {
      console.error('Tool registration failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ToolForm onSubmit={handleRegister} />
    </form>
  )
}
```

#### Execution Handling
```tsx
function ToolExecution({ tool }: { tool: Tool }) {
  const execute = useStore(state => state.executeTool)
  const status = useStore(state => state.status)

  const handleExecute = async (params: unknown) => {
    try {
      await execute(tool.name, params)
    } catch (error) {
      console.error('Tool execution failed:', error)
    }
  }

  return (
    <div className="tool-execution">
      <ToolParams tool={tool} onSubmit={handleExecute} />
      <ExecutionStatus status={status} />
    </div>
  )
}
```

#### Model Configuration
```tsx
function ModelConfig() {
  const config = useStore(state => state.modelConfig)
  const updateConfig = useStore(state => state.updateConfig)

  return (
    <div className="model-config">
      <select
        value={config.model}
        onChange={(e) => updateConfig({ model: e.target.value })}
      >
        <option value="gpt-4">GPT-4</option>
        <option value="claude-3">Claude 3</option>
      </select>
      <ConfigOptions config={config} onChange={updateConfig} />
    </div>
  )
}
```

## Component Library

### Tool Components
- `ToolCard`: Tool display card
- `ToolParams`: Parameter input form
- `ToolResults`: Result display
- `ToolHistory`: Execution history
- `ToolDocs`: Tool documentation

### Model Components
- `ModelSelector`: Model selection
- `ModelConfig`: Configuration panel
- `TokenCounter`: Token usage display
- `RateLimit`: Rate limit indicator
- `CostEstimate`: Usage cost display

### Execution Components
- `ExecutionPanel`: Main execution UI
- `StatusIndicator`: Execution status
- `ProgressBar`: Operation progress
- `ErrorBoundary`: Error handling
- `RetryButton`: Retry failed operations

## Development

### Adding New Tools

1. Create tool definition:
```typescript
// src/components/mcp/tools/my-tool.ts
import { type Tool } from '@danky/mcp'

export const myTool: Tool = {
  name: 'myTool',
  description: 'Does something useful',
  parameters: {
    // Zod schema
  },
  handler: async (params) => {
    // Implementation
  }
}
```

2. Register tool:
```typescript
// src/components/mcp/tools/index.ts
export const tools = [myTool]
```

### Testing
```bash
pnpm test
pnpm test:watch
```

### Storybook
```bash
pnpm storybook
```

## Styling

### CSS Modules
```css
/* styles.module.css */
.toolCard {
  @apply rounded-lg border p-4;
}

.executing {
  @apply bg-primary/10;
}

.error {
  @apply bg-destructive/10;
}
```

### Theme Variables
```css
:root {
  --tool-bg: hsl(var(--card));
  --executing-bg: hsl(var(--primary));
  --error-bg: hsl(var(--destructive));
}
```

## Additional Resources

- [MCP Integration Guide](../../../docs/MCP.md)
- [Tool Development Guide](../../../docs/TOOLS.md)
- [Model Configuration](../../../docs/MODELS.md)
- [Error Handling](../../../docs/ERRORS.md)

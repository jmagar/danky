# Chat Components

React components for the chat interface in the Danky AI Chatbot platform.

## Overview

The chat components handle the real-time chat interface, message rendering, input handling, and chat-specific UI elements.

## Components

### Core Components
- `ChatLayout`: Main chat interface layout
- `ChatMessages`: Message list container
- `Message`: Individual message component
- `MessageContent`: Message content renderer
- `ChatInput`: Message input component

### Supporting Components
- `AttachmentButton`: File attachment handling
- `ToolsDropdown`: AI tool selection
- `NotificationsPopover`: Chat notifications
- `SessionList`: Chat session management
- `ThemeToggle`: Theme switching

## State Management

### Chat Store
```typescript
interface ChatState {
  messages: Message[]
  sessions: Session[]
  currentSession: Session | null
  isLoading: boolean
  error: Error | null
}
```

### Actions
- `sendMessage`: Send new message
- `loadSession`: Load chat session
- `clearSession`: Clear current session
- `attachFile`: Handle file attachments
- `selectTool`: Select AI tool

## AI Development Notes

### Key Concepts

1. **Message Handling**
   - Message formatting
   - Markdown support
   - Code highlighting
   - File attachments

2. **Session Management**
   - Session persistence
   - Session switching
   - Session metadata
   - Session cleanup

3. **Tool Integration**
   - Tool selection
   - Tool execution
   - Tool results
   - Error handling

### Common Patterns

#### Message Rendering
```tsx
function Message({ message }: { message: Message }) {
  return (
    <div className="message">
      <Avatar user={message.user} />
      <MessageContent content={message.content} />
      <MessageActions message={message} />
    </div>
  )
}
```

#### Input Handling
```tsx
function ChatInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  )
}
```

#### Session Loading
```tsx
function SessionList() {
  const sessions = useStore(state => state.sessions)
  const loadSession = useStore(state => state.loadSession)

  return (
    <div className="sessions">
      {sessions.map(session => (
        <button key={session.id} onClick={() => loadSession(session.id)}>
          {session.title}
        </button>
      ))}
    </div>
  )
}
```

## Component Library

### Message Components
- `Message`: Base message component
- `UserMessage`: User message variant
- `AIMessage`: AI message variant
- `SystemMessage`: System message variant
- `ErrorMessage`: Error message variant

### Input Components
- `ChatInput`: Main input component
- `AttachmentButton`: File upload button
- `ToolsDropdown`: Tool selection dropdown
- `SendButton`: Message send button
- `CancelButton`: Cancel operation button

### Session Components
- `SessionList`: Session list component
- `SessionItem`: Individual session item
- `SessionHeader`: Session header with metadata
- `SessionActions`: Session action buttons
- `NewSessionButton`: Create new session

## Development

### Adding New Components

1. Create component file:
```tsx
// src/components/chat/my-component.tsx
export function MyComponent() {
  return <div>New Component</div>
}
```

2. Add to index:
```typescript
// src/components/chat/index.ts
export * from './my-component'
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
.message {
  @apply flex items-start gap-4 p-4;
}

.userMessage {
  @apply bg-primary/10;
}

.aiMessage {
  @apply bg-secondary/10;
}
```

### Theme Variables
```css
:root {
  --chat-bg: hsl(var(--background));
  --message-bg: hsl(var(--secondary));
  --input-bg: hsl(var(--background));
}
```

## Additional Resources

- [Chat System Design](../../../docs/CHAT_SYSTEM.md)
- [Message Format Spec](../../../docs/MESSAGE_FORMAT.md)
- [Tool Integration Guide](../../../docs/TOOLS.md)
- [Session Management](../../../docs/SESSIONS.md)

'use client'

import { cn } from '@danky/ui'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatMessagesProps {
  messages: ChatMessage[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            'flex w-full',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          <div
            className={cn(
              'rounded-lg px-4 py-2 max-w-[80%]',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
} 
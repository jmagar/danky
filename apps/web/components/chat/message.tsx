"use client"

import { cn } from '@danky/ui'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatMessageProps {
  message: ChatMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
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
  )
} 
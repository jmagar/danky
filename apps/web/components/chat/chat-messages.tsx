'use client'

import { Message } from './message'
import { type Message as MessageType } from './types'
import { cn } from '@danky/ui'

interface ChatMessagesProps {
  messages: MessageType[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex flex-col space-y-4">
      {messages.map((message, index) => (
        <Message
          key={`${message.role}-${index}-${message.timestamp.getTime()}`}
          role={message.role}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
      {messages.length === 0 && (
        <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
          Start a conversation...
        </div>
      )}
    </div>
  )
}
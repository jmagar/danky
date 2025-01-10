'use client';

import { Message } from './message';
import { type Message as MessageType } from './types';
import { cn } from '@danky/ui/utils';

interface ChatMessagesProps {
  messages: MessageType[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex flex-col space-y-4">
      {messages.map((message, index) => {
        // Get the first text content from the message
        const content = Array.isArray(message.content)
          ? message.content[0]?.content || ''
          : message.content;

        return (
          <Message
            key={`${message.role}-${index}-${message.timestamp.getTime()}`}
            role={message.role}
            content={content}
            timestamp={message.timestamp}
          />
        );
      })}
      {messages.length === 0 && (
        <div className="text-muted-foreground flex h-[50vh] items-center justify-center">
          Start a conversation...
        </div>
      )}
    </div>
  );
}

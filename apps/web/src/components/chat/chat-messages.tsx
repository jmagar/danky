'use client';

import React from 'react';
import { ScrollArea } from '@danky/ui';
import { Message } from './message';
import { useChat } from '@/hooks/use-chat';

export function ChatMessages() {
  const { messages } = useChat();

  return (
    <ScrollArea className="flex-1 p-4">
      {messages.map(message => (
        <Message key={message.id} message={message} />
      ))}
    </ScrollArea>
  );
}

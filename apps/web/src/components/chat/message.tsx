'use client';

import React from 'react';
import { cn } from '@danky/ui';
import { MessageContent } from './message-content';
import type { Message as MessageType } from './types';

interface MessageProps {
  message: MessageType;
  className?: string;
}

export function Message({ message, className }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn('flex w-full gap-2 py-2', isUser ? 'flex-row-reverse' : 'flex-row', className)}
    >
      <div
        className={cn(
          'flex max-w-[80%] flex-col gap-2 rounded-lg p-4',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <MessageContent content={message.content} />
      </div>
    </div>
  );
}

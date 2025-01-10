'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@danky/ui';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { MessageContent } from './message-content';
import { cn } from '@danky/ui/utils';
import { type Message as MessageType, type ContentType } from './types';

export type MessageProps = Omit<MessageType, 'content'> & {
  content: ContentType[];
};

function renderContent(content: ContentType) {
  switch (content.type) {
    case 'text':
      return (
        <ReactMarkdown
          className="prose dark:prose-invert max-w-none text-sm"
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {content.content}
        </ReactMarkdown>
      );
    case 'code':
      return (
        <MessageContent
          content={content.content}
          language={content.language}
          fileName={content.fileName}
          lineNumbers={content.lineNumbers}
        />
      );
    case 'image':
      return (
        <img
          src={content.content}
          alt={content.altText || 'Image'}
          className="max-w-full rounded-lg"
          style={{
            width: content.width,
            height: content.height,
          }}
        />
      );
    case 'file':
      return (
        <a
          href={content.content}
          download={content.fileName}
          className="bg-muted hover:bg-muted/80 flex items-center gap-2 rounded-lg p-2 text-sm"
        >
          <span>{content.fileName}</span>
          <span className="text-muted-foreground text-xs">
            ({Math.round(content.fileSize / 1024)}KB)
          </span>
        </a>
      );
  }
}

export function Message({ role, content, timestamp = new Date() }: MessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex w-full gap-4 p-4', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={isUser ? '/avatar.png' : '/bot-avatar.png'}
          alt={isUser ? 'User' : 'Assistant'}
        />
        <AvatarFallback>{isUser ? 'U' : 'A'}</AvatarFallback>
      </Avatar>

      <div className={cn('flex max-w-[80%] flex-col', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-lg px-4 py-2',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
        >
          {content.map((item, index) => (
            <div key={index} className={cn('message-content', index > 0 && 'mt-2')}>
              {renderContent(item)}
            </div>
          ))}
        </div>

        <span className="text-muted-foreground mt-1 text-xs">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}

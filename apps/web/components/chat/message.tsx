'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@danky/ui'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { MessageContent } from './message-content'
import { cn } from '@danky/ui'

export interface MessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export function Message({ role, content, timestamp = new Date() }: MessageProps) {
  const isUser = role === 'user'
  
  return (
    <div
      className={cn(
        'flex w-full gap-4 p-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage 
          src={isUser ? '/avatar.png' : '/bot-avatar.png'} 
          alt={isUser ? 'User' : 'Assistant'} 
        />
        <AvatarFallback>
          {isUser ? 'U' : 'A'}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn('flex flex-col max-w-[80%]', 
        isUser ? 'items-end' : 'items-start'
      )}>
        <div
          className={cn(
            'rounded-lg px-4 py-2',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
        >
          {content.match(/^```[\s\S]*```$/) ? (
            <MessageContent content={content} />
          ) : (
            <ReactMarkdown
              className="prose dark:prose-invert max-w-none text-sm"
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
      </div>
    </div>
  )
}
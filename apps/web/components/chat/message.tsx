"use client"

import { Card, CardContent, Avatar, AvatarFallback, cn } from "@danky/ui"
import { Bot, User } from "lucide-react"
import { Message } from "./types"
import { formatTime } from "./utils"
import { MessageContent } from "./message-content"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const timestamp = message.timestamp instanceof Date 
    ? message.timestamp 
    : new Date(message.timestamp)

  return (
    <div className={cn(
      "group relative flex items-start gap-3 px-4 py-6",
      "hover:bg-muted/50 transition-colors",
      isUser && "flex-row-reverse"
    )}>
      <Avatar className={cn(
        "h-8 w-8 shrink-0",
        isUser ? "bg-primary" : "bg-muted"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-muted-foreground" />
        )}
        <AvatarFallback>
          {isUser ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "flex flex-col gap-1.5 min-w-0",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "relative rounded-lg px-4 py-3 text-sm leading-relaxed break-words",
          "max-w-[85%] min-w-[100px]",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-foreground",
          "shadow-sm"
        )}>
          <MessageContent content={message.content} />
        </div>
        <span className={cn(
          "text-xs text-muted-foreground px-1",
          "opacity-0 group-hover:opacity-100 transition-opacity"
        )}>
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  )
} 
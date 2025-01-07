"use client"

import { Card, CardContent, Avatar, AvatarFallback } from "@danky/ui"
import { Bot, User } from "lucide-react"
import { cn } from "@danky/ui/lib/utils"
import { Message } from "./types"
import { formatTime } from "./utils"

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
      "flex items-start gap-3 py-2",
      isUser && "flex-row-reverse"
    )}>
      <Avatar className={cn(
        "h-8 w-8 shrink-0",
        isUser ? "bg-primary" : "bg-secondary"
      )}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
        <AvatarFallback>
          {isUser ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "flex flex-col gap-1 min-w-0",
        isUser && "items-end"
      )}>
        <Card className={cn(
          "max-w-[80%]",
          isUser && "bg-primary text-primary-foreground"
        )}>
          <CardContent className="p-3 text-sm break-words">
            {message.content}
          </CardContent>
        </Card>
        <span className="text-xs text-muted-foreground px-1">
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  )
} 
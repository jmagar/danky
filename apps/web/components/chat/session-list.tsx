"use client"

import { ScrollArea, Card, CardContent, cn } from "@danky/ui"
import { ChatSession } from "./types"
import { MessageSquare } from "lucide-react"

interface ChatSessionListProps {
  sessions: ChatSession[]
  onSelectSession?: (session: ChatSession) => void
  currentSessionId?: string
}

export function ChatSessionList({ 
  sessions, 
  onSelectSession,
  currentSessionId 
}: ChatSessionListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-0.5 p-2">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession?.(session)}
            className={cn(
              "flex items-start gap-3 p-3 w-full text-left rounded-lg transition-colors",
              "hover:bg-accent/50",
              session.id === currentSessionId && "bg-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <MessageSquare className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 font-medium truncate">
                {session.title}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {session.lastMessage}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
} 
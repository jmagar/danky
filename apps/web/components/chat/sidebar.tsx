"use client"

import { Button, cn } from "@danky/ui"
import { type ChatSession } from "./types"
import { MessageSquare, Plus } from "lucide-react"

interface SidebarProps {
  sessions: ChatSession[]
  onNewChat: () => void
  onSelectSession: (session: ChatSession) => void
  currentSessionId: string
  isOpen: boolean
  _onToggle: () => void
}

export function Sidebar({
  sessions,
  onNewChat,
  onSelectSession,
  currentSessionId,
  isOpen,
  _onToggle
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          onClick={onNewChat}
          className={cn(
            "gap-2 w-full justify-start",
            !isOpen && "justify-center"
          )}
          variant="outline"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {isOpen && <span>New Chat</span>}
        </Button>
      </div>

      <div className={cn(
        "flex-1 overflow-hidden",
        !isOpen && "opacity-0"
      )}>
        <div className="flex flex-col gap-0.5 p-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg transition-colors",
                "hover:bg-accent/50",
                session.id === currentSessionId && "bg-accent",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              {isOpen && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {session.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {session.lastMessage}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 
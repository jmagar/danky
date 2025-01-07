"use client"

import { Button } from "@danky/ui"
import { ChatSession } from "./types"
import { ChevronLeft, MessageSquare, Plus } from "lucide-react"
import { cn } from "@danky/ui/lib/utils"

interface SidebarProps {
  sessions: ChatSession[]
  onNewChat: () => void
  onSelectSession: (session: ChatSession) => void
  currentSessionId: string
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({
  sessions,
  onNewChat,
  onSelectSession,
  currentSessionId,
  isOpen,
  onToggle
}: SidebarProps) {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-20",
      "flex flex-col w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "transition-all duration-300 ease-in-out",
      "md:relative md:translate-x-0",
      !isOpen && "-translate-x-full md:w-20"
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        <Button 
          onClick={onNewChat}
          className={cn(
            "gap-2 w-full justify-start",
            !isOpen && "md:justify-center"
          )}
          variant="outline"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {(isOpen || !window?.matchMedia('(min-width: 768px)').matches) && (
            <span>New Chat</span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={onToggle}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-200",
            !isOpen && "rotate-180"
          )} />
          <span className="sr-only">
            {isOpen ? "Collapse sidebar" : "Expand sidebar"}
          </span>
        </Button>
      </div>

      <div className={cn(
        "flex-1 overflow-hidden",
        !isOpen && "md:opacity-0 md:invisible"
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
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {session.title}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {session.lastMessage}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
} 
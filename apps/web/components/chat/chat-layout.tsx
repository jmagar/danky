"use client"

import * as React from "react"
import { cn } from "@danky/ui"
import { Button } from "@danky/ui"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Search } from "./search"
import { ThemeToggle } from "@danky/ui"
import { NotificationsPopover } from "./notifications-popover"

interface ChatLayoutProps {
  children?: React.ReactNode
  sidebar?: React.ReactNode
  className?: string
}

export function ChatLayout({
  children,
  sidebar,
  className,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div className="h-[100dvh] w-full flex">
      <div
        className={cn(
          "bg-background/50 h-full transition-all duration-300 ease-in-out border-r backdrop-blur-sm",
          isCollapsed ? "w-0" : "w-[280px]"
        )}
      >
        {sidebar}
      </div>
      <div className="flex-1 bg-background h-full">
        <div className="flex h-full flex-col w-full">
          <div className="relative flex h-14 items-center border-b px-4 backdrop-blur-sm bg-background/50">
            <div className="absolute left-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 hover:bg-muted/80 transition-colors"
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex-1 flex justify-center items-center px-16">
              <div className="w-full max-w-2xl">
                <Search />
              </div>
            </div>
            <div className="absolute right-4 flex items-center gap-2">
              <ThemeToggle />
              <NotificationsPopover />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 
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
          "bg-background/50 h-full transition-all duration-300 ease-in-out border-r",
          isCollapsed ? "w-0" : "w-[280px]"
        )}
      >
        {sidebar}
      </div>
      <div className="flex-1 bg-background h-full">
        <div className="flex h-full flex-col w-full">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center gap-4">
              <Search />
            </div>
            <div className="flex-1 flex justify-end items-center gap-2">
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
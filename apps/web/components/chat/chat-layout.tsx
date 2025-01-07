"use client"

import * as React from "react"
import { cn } from "@danky/ui"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Button,
  ScrollArea,
} from "@danky/ui"
import { Bot, ChevronLeft, ChevronRight } from "lucide-react"
import { Search } from "./search"
import { UserNav } from "./user-nav"

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
    <div className="h-[100dvh] w-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full items-stretch"
      >
        <ResizablePanel
          defaultSize={15}
          collapsible={true}
          collapsedSize={4}
          minSize={10}
          maxSize={20}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          className={cn(
            "bg-background/50 h-full",
            isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                {!isCollapsed && (
                  <span className="font-semibold">DANKY</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                </span>
              </Button>
            </div>
            <ScrollArea className="flex-1">
              {sidebar}
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="w-[2px] bg-border" />
        <ResizablePanel defaultSize={85} className="bg-background h-full">
          <div className="flex h-full flex-col w-full">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-4 flex-1">
                <Search />
              </div>
              <UserNav />
            </div>
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
} 
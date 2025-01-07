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
import { Bot, PanelLeft, PanelLeftClose } from "lucide-react"

interface ChatLayoutProps {
  children?: React.ReactNode
  sidebar?: React.ReactNode
  toolsButton?: React.ReactNode
  _className?: string
}

export function ChatLayout({
  children,
  sidebar,
  toolsButton,
  _className,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div className="fixed inset-0">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full"
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
            "bg-background border-r",
            isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <ScrollArea className="h-full">
            {sidebar}
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle className="w-[2px] bg-border" />
        <ResizablePanel defaultSize={85} className="bg-background">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b">
              <div className="flex w-full items-center px-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="md:hidden"
                  >
                    {isCollapsed ? (
                      <PanelLeft className="h-4 w-4" />
                    ) : (
                      <PanelLeftClose className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                </div>
                <div className="flex flex-1 items-center justify-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <h1 className="text-xl font-semibold tracking-tight">DANKY</h1>
                </div>
              </div>
              <div className="flex min-w-[240px] items-center justify-end px-4">
                {toolsButton}
              </div>
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
"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../resizable"
import { Button } from "../button"
import { ScrollArea } from "../scroll-area"
import { Mic, Settings, Plus, PanelLeftClose, PanelLeft, Bot } from "lucide-react"
import { Separator } from "../separator"

interface ChatLayoutProps {
  children?: React.ReactNode
  sidebar?: React.ReactNode
  toolsButton?: React.ReactNode
  className?: string
}

export function ChatLayout({
  children,
  sidebar,
  toolsButton,
  className,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full"
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
            "bg-background/50",
            isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex h-[52px] items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              {!isCollapsed && (
                <>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Separator />
          <ScrollArea className="h-[calc(100dvh-53px)]">
            {sidebar}
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={85} className="relative">
          <div className="flex h-full flex-col">
            <div className="flex h-[52px] items-center justify-center border-b bg-background/50">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold tracking-tight">DANKY</h1>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {children}
            </div>
            <Separator />
            <div className="relative bg-background/50 px-4 py-2">
              {toolsButton || (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute bottom-4 right-8"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
} 
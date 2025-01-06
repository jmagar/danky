"use client"

import * as React from "react"
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  type ImperativePanelGroupHandle,
  type ImperativePanelHandle,
  type PanelProps,
  type PanelResizeHandleProps,
  type PanelGroupProps,
} from "react-resizable-panels"
import { cn } from "../lib/utils"

interface ResizablePanelGroupProps extends PanelGroupProps {
  className?: string
}

interface ResizablePanelProps extends Omit<PanelProps, 'onCollapse'> {
  className?: string
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

interface ResizableHandleProps extends Omit<PanelResizeHandleProps, 'children'> {
  className?: string
  withHandle?: boolean
}

const ResizablePanelGroup = React.forwardRef<ImperativePanelGroupHandle, ResizablePanelGroupProps>(
  ({ className, ...props }, ref) => (
    <PanelGroup
      ref={ref}
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
)
ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = React.forwardRef<ImperativePanelHandle, ResizablePanelProps>(
  ({ className, collapsed, onCollapse, ...props }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(collapsed)

    React.useEffect(() => {
      setIsCollapsed(collapsed)
    }, [collapsed])

    const handleCollapse = React.useCallback(() => {
      const newCollapsed = !isCollapsed
      setIsCollapsed(newCollapsed)
      onCollapse?.(newCollapsed)
    }, [isCollapsed, onCollapse])

    return (
      <Panel
        ref={ref}
        className={cn("relative flex h-full w-full", className)}
        onCollapse={handleCollapse}
        {...props}
      />
    )
  }
)
ResizablePanel.displayName = "ResizablePanel"

const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ className, withHandle, ...props }, ref) => {
    const handle = withHandle ? (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-2.5 w-2.5"
        >
          <path d="M8 5L12 9L16 5" />
          <path d="M8 13L12 17L16 13" />
        </svg>
      </div>
    ) : null

    return (
      <PanelResizeHandle
        {...props}
        className={cn(
          "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
          className
        )}
      >
        {handle}
      </PanelResizeHandle>
    )
  }
)
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanel, ResizablePanelGroup, ResizableHandle }

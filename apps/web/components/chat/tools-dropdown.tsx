"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Button,
  Badge,
  cn
} from "@danky/ui"
import { type Server } from "./types"
import { Wrench, CircleDot, Loader2, AlertCircle } from "lucide-react"

interface ToolsDropdownProps {
  servers: Server[]
  onToolSelect: (serverId: string, toolId: string) => void
  isLoading?: boolean
}

export function ToolsDropdown({ servers, onToolSelect, isLoading = false }: ToolsDropdownProps) {
  const hasServers = servers.length > 0
  const connectedServers = servers.filter(s => s.status === "connected")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className={cn(
            "relative transition-colors",
            hasServers && "text-primary border-primary hover:bg-primary/10"
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Wrench className="h-4 w-4" />
              {hasServers && (
                <Badge 
                  variant="default" 
                  className={cn(
                    "absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center",
                    "animate-in zoom-in-50 duration-300"
                  )}
                >
                  {connectedServers.length}
                </Badge>
              )}
            </>
          )}
          <span className="sr-only">Available tools</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-72"
        sideOffset={8}
      >
        {isLoading ? (
          <div className="p-4 text-sm text-center flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Connecting to servers...</span>
          </div>
        ) : !hasServers ? (
          <div className="p-4 text-sm text-center flex flex-col items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span>No servers available</span>
          </div>
        ) : connectedServers.length === 0 ? (
          <div className="p-4 text-sm text-center flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Waiting for servers to connect...</span>
          </div>
        ) : (
          <>
            {connectedServers.map((server) => (
              <div key={server.id} className="animate-in fade-in-50 duration-200">
                <div className="px-2 py-1.5 text-sm font-medium flex items-center gap-2">
                  <CircleDot className="h-3 w-3 text-primary animate-pulse" />
                  {server.name}
                </div>

                {server.tools.map((tool) => (
                  <DropdownMenuItem
                    key={tool.id}
                    onClick={() => onToolSelect(server.id, tool.id)}
                    className="flex flex-col items-start gap-0.5 pl-7 cursor-pointer"
                  >
                    <span className="font-medium">{tool.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {tool.description}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </div>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
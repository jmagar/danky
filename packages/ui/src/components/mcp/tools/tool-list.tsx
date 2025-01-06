'use client'

import { ToolCard } from './tool-card'

export interface ToolListProps {
  tools: Array<{
    serverId: string
    toolId: string
    name: string
    description: string
  }>
  onToolSelect?: (serverId: string, toolId: string) => void
}

export function ToolList({ tools, onToolSelect }: ToolListProps) {
  if (!tools.length) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No MCP tools available
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard
          key={`${tool.serverId}-${tool.toolId}`}
          serverId={tool.serverId}
          toolId={tool.toolId}
          name={tool.name}
          description={tool.description}
          onSelect={() => onToolSelect?.(tool.serverId, tool.toolId)}
        />
      ))}
    </div>
  )
} 
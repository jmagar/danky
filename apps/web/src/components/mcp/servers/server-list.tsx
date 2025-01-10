'use client'

import { ServerCard } from './server-card'

export interface ServerListProps {
  servers: Array<{
    id: string
    status: 'connected' | 'disconnected' | 'error'
    description?: string
  }>
  onServerSelect?: (serverId: string) => void
}

export function ServerList({ servers, onServerSelect }: ServerListProps) {
  if (!servers.length) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No MCP servers available
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {servers.map((server) => (
        <ServerCard
          key={server.id}
          serverId={server.id}
          status={server.status}
          description={server.description}
          onSelect={() => onServerSelect?.(server.id)}
        />
      ))}
    </div>
  )
} 
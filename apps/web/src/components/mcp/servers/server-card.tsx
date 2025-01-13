'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../card'
import { Badge } from '../../ui/badge'

export interface ServerCardProps {
  serverId: string
  status: 'connected' | 'disconnected' | 'error'
  description?: string
  onSelect?: () => void
}

export function ServerCard({ serverId, status, description, onSelect }: ServerCardProps) {
  const statusColors = {
    connected: 'bg-green-500',
    disconnected: 'bg-gray-500',
    error: 'bg-red-500',
  }

  return (
    <Card
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={onSelect}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {serverId}
        </CardTitle>
        <Badge variant="outline" className={statusColors[status]}>
          {status}
        </Badge>
      </CardHeader>
      {description && (
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      )}
    </Card>
  )
}

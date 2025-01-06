'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../card'
import { Badge } from '../../badge'

export interface ToolCardProps {
  serverId: string
  toolId: string
  name: string
  description: string
  onSelect?: () => void
}

export function ToolCard({ serverId, toolId, name, description, onSelect }: ToolCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={onSelect}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">
            {name}
          </CardTitle>
          <CardDescription className="text-xs">
            Server: {serverId}
          </CardDescription>
        </div>
        <Badge variant="outline" className="bg-blue-500">
          Tool
        </Badge>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
} 
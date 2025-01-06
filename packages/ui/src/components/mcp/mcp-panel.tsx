'use client'

import { useEffect, useState } from 'react'
import { ServerList } from './servers/server-list'
import { ToolList } from './tools/tool-list'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs'
import { useToast } from '../../hooks/use-toast'

interface MCPPanelProps {
  onToolSelect?: (serverId: string, toolId: string) => void
}

export function MCPPanel({ onToolSelect }: MCPPanelProps) {
  const [servers, setServers] = useState<Array<{
    id: string
    status: 'connected' | 'disconnected' | 'error'
    description?: string
  }>>([])
  
  const [tools, setTools] = useState<Array<{
    serverId: string
    toolId: string
    name: string
    description: string
  }>>([])

  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch server status
        const serverRes = await fetch('/api/actions/mcp/status')
        const serverData = await serverRes.json()
        if (serverData.success) {
          setServers(Object.entries(serverData.status).map(([id, status]) => ({
            id,
            status: status as 'connected' | 'disconnected' | 'error'
          })))
        }

        // Fetch available tools
        const toolsRes = await fetch('/api/actions/mcp/tools')
        const toolsData = await toolsRes.json()
        if (toolsData.success) {
          setTools(toolsData.tools)
        }
      } catch (error) {
        toast.error('Failed to fetch MCP data')
      }
    }

    // Initial fetch
    fetchData()

    // Set up polling for updates every 30 seconds
    const interval = setInterval(fetchData, 30000)

    return () => clearInterval(interval)
  }, [toast])

  return (
    <Card>
      <CardHeader>
        <CardTitle>MCP Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="servers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="servers">Servers</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="servers" className="mt-4">
            <ServerList 
              servers={servers}
              onServerSelect={(serverId) => {
                toast.success(`Connected to ${serverId}`)
              }}
            />
          </TabsContent>
          <TabsContent value="tools" className="mt-4">
            <ToolList 
              tools={tools}
              onToolSelect={onToolSelect}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 
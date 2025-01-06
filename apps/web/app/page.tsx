"use client"

import { useState, useEffect } from "react"
import {
  ChatLayout,
  Card,
  CardContent,
  Button,
  ScrollArea,
  Textarea,
  Avatar,
  AvatarFallback,
  AvatarImage,
  ToolsButton,
} from "@danky/ui"
import { SendHorizontal } from "lucide-react"
import { getServerStatus, getAvailableTools, processMessage } from "./api/actions/mcp"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

interface Server {
  id: string
  name: string
  status: "connected" | "disconnected" | "error"
  tools: Array<{
    id: string
    name: string
    description: string
  }>
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "General Chat",
      lastMessage: "Hello! How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [servers, setServers] = useState<Server[]>([])

  useEffect(() => {
    const fetchMCPData = async () => {
      try {
        // Fetch server status
        const serverRes = await getServerStatus()
        if (!serverRes.success || !serverRes.status) return

        // Fetch available tools
        const toolsRes = await getAvailableTools()
        if (!toolsRes.success || !toolsRes.tools) return

        // Group tools by server
        const toolsByServer = toolsRes.tools.reduce((acc, tool) => {
          if (!acc[tool.serverId]) {
            acc[tool.serverId] = []
          }
          acc[tool.serverId].push({
            id: tool.toolId,
            name: tool.name,
            description: tool.description,
          })
          return acc
        }, {} as Record<string, Server['tools']>)

        // Create server list
        const serverList = Object.entries(serverRes.status).map(([id, status]) => ({
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize first letter
          status: status as Server['status'],
          tools: toolsByServer[id] || [],
        }))

        setServers(serverList)
      } catch (error) {
        console.error('Failed to fetch MCP data:', error)
      }
    }

    // Initial fetch
    fetchMCPData()

    // Set up polling for updates every 30 seconds
    const interval = setInterval(fetchMCPData, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      // Process the message through MCP
      const response = await processMessage({ message: input })
      
      if (!response.success || !response.response) {
        throw new Error(response.error || 'Failed to process message')
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error processing message:', error)
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I encountered an error processing your message. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      lastMessage: "Start a new conversation",
      timestamp: new Date(),
    }
    setChatSessions((prev) => [newSession, ...prev])
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <ChatLayout
      sidebar={
        <ScrollArea className="h-full">
          <div className="space-y-2 p-2">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={handleNewChat}
            >
              New Chat
            </Button>
            {chatSessions.map((session) => (
              <Card key={session.id} className="cursor-pointer hover:bg-accent">
                <CardContent className="p-3">
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {session.lastMessage}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      }
      toolsButton={
        <ToolsButton
          servers={servers}
          onToolSelect={(serverId, toolId) => {
            console.log("Selected tool:", serverId, toolId)
            // TODO: Implement tool execution
          }}
        />
      }
    >
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-8 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-start gap-4 max-w-[70%]">
                  {message.role === "assistant" && (
                    <Avatar>
                      <AvatarImage src="/bot-avatar.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col gap-2">
                    <Card className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                      <CardContent className="p-4">
                        {message.content}
                      </CardContent>
                    </Card>
                    <span className="text-xs text-muted-foreground px-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarImage src="/avatar.png" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t bg-background">
          <div className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={!input.trim()}>
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}

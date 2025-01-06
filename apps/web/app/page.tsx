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
  const [isLoading, setIsLoading] = useState(false)
  const [isAgentReady, setIsAgentReady] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkAgentStatus = async () => {
      try {
        const res = await fetch("/api/chat")
        const data = await res.json()
        
        if (data.status === "ready") {
          setIsAgentReady(true)
          setServers(Array.isArray(data.servers) ? data.servers : [])
        } else {
          setIsAgentReady(false)
          setServers([])
          // Retry after 5 seconds if not ready
          setTimeout(checkAgentStatus, 5000)
        }
      } catch (error) {
        console.error("Failed to check agent status:", error)
        setIsAgentReady(false)
        setServers([])
        // Retry after 5 seconds on error
        setTimeout(checkAgentStatus, 5000)
      }
    }

    checkAgentStatus()
  }, [mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !isAgentReady) return

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to process message")
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I apologize, but I encountered an error processing your message. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error processing message:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: error instanceof Error ? error.message : "I apologize, but I encountered an error processing your message. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
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
    setMessages([])
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
        mounted ? (
          <ToolsButton
            servers={servers}
            onToolSelect={(serverId, toolId) => {
              console.log("Selected tool:", serverId, toolId)
            }}
          />
        ) : null
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
                placeholder={!mounted ? "Loading..." : isAgentReady ? "Type your message..." : "Initializing..."}
                className="min-h-[60px]"
                disabled={!mounted || !isAgentReady}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!mounted || !input.trim() || isLoading || !isAgentReady}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}

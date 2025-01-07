"use client"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@danky/ui"
import { Message, ChatSession, Server } from "@/components/chat/types"
import { ChatMessage } from "@/components/chat/message"
import { ChatInput } from "@/components/chat/input"
import { ToolsDropdown } from "@/components/chat/tools-dropdown"
import { ThemeToggle } from "@/components/chat/theme-toggle"
import { Sidebar } from "@/components/chat/sidebar"
import { ChatLayout } from "@/components/chat/chat-layout"

const POLLING_INTERVAL = 5000 // 5 seconds

export default function ChatPage() {
  // State
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [servers, setServers] = useState<Server[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAgentReady, setIsAgentReady] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(setTimeout(() => {}, 0))

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load chat sessions
  useEffect(() => {
    if (!mounted) return

    const loadSessions = async () => {
      try {
        const res = await fetch('/api/chat/sessions')
        if (!res.ok) throw new Error('Failed to load sessions')
        const data = await res.json()
        
        const sessions = data.sessions?.map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp)
        })) || []

        setChatSessions(sessions)
        if (sessions.length > 0 && !currentSession) {
          setCurrentSession(sessions[0].id)
        }
      } catch (error) {
        console.error("Failed to load sessions:", error)
        // Don't automatically create a session on error
      }
    }

    loadSessions()
  }, [mounted, currentSession])

  // Load messages for current session
  useEffect(() => {
    if (!currentSession || !mounted) return

    const loadSessionMessages = async () => {
      try {
        const res = await fetch(`/api/chat/sessions/${currentSession}/messages`)
        if (!res.ok) throw new Error('Failed to load messages')
        const data = await res.json()
        setMessages(data.messages?.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })) || [])
      } catch (error) {
        console.error("Failed to load session messages:", error)
      }
    }

    loadSessionMessages()
  }, [currentSession, mounted])

  // Server status polling
  useEffect(() => {
    if (!mounted) return

    const checkAgentStatus = async () => {
      try {
        const res = await fetch("/api/chat")
        if (!res.ok) throw new Error('Failed to check status')
        const data = await res.json()
        
        setIsAgentReady(data.status === "ready")
        setServers(data.servers || [])
      } catch (error) {
        console.error("Failed to check agent status:", error)
        setIsAgentReady(false)
        setServers([])
      }

      pollingTimeoutRef.current = setTimeout(checkAgentStatus, POLLING_INTERVAL)
    }

    checkAgentStatus()
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current)
      }
    }
  }, [mounted])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !isAgentReady || !currentSession) return

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          sessionId: currentSession
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')
      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setChatSessions(prev => prev.map(session => 
        session.id === currentSession 
          ? { ...session, lastMessage: input, timestamp: new Date() }
          : session
      ))
    } catch (error) {
      console.error("Error processing message:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: error instanceof Error ? error.message : "An error occurred while processing your message.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = async () => {
    try {
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Chat",
          lastMessage: "Start a new conversation"
        }),
      })

      if (!response.ok) throw new Error('Failed to create chat')
      const data = await response.json()

      const newSession: ChatSession = {
        id: data.sessionId,
        title: "New Chat",
        lastMessage: "Start a new conversation",
        timestamp: new Date()
      }

      setChatSessions(prev => [newSession, ...prev])
      setCurrentSession(newSession.id)
      setMessages([])
    } catch (error) {
      console.error("Failed to create new chat:", error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        sessions={chatSessions}
        onNewChat={handleNewChat}
        onSelectSession={(session) => setCurrentSession(session.id)}
        currentSessionId={currentSession || ""}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-4">
            <div className="flex-1 flex items-center justify-end gap-2">
              <ThemeToggle />
              <ToolsDropdown
                servers={servers}
                onToolSelect={(serverId, toolId) => {
                  console.log("Selected tool:", serverId, toolId)
                }}
                isLoading={!isAgentReady}
              />
            </div>
          </div>
        </header>

        <ScrollArea 
          className="flex-1" 
          ref={scrollAreaRef}
        >
          <div className="flex flex-col gap-2 p-4 pb-8">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-3xl p-4">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isDisabled={!isAgentReady || !currentSession}
              placeholder={!isAgentReady ? "Initializing..." : "Type your message..."}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

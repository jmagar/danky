"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@danky/ui"
import { ChatMessage } from "@/components/chat/message"
import { ChatInput } from "@/components/chat/input"
import { ToolsDropdown } from "@/components/chat/tools-dropdown"
import { ThemeToggle } from "@/components/chat/theme-toggle"
import { Sidebar } from "@/components/chat/sidebar"
import { ChatLayout } from "@/components/chat/chat-layout"
import { useChatStore } from "@/lib/stores/chat-store"
import { useMCPStore } from "@/lib/stores/mcp-store"

const POLLING_INTERVAL = 5000 // 5 seconds

export default function ChatPage() {
  // Get state and actions from store
  const {
    messages,
    sessions,
    currentSession,
    isLoading,
    isAgentReady,
    isSidebarOpen,
    servers,
    error,
    sendMessage,
    createNewChat,
    loadMessages,
    loadSessions,
    setIsAgentReady,
    setIsSidebarOpen,
    setServers,
    setCurrentSession,
  } = useChatStore()

  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(setTimeout(() => {}, 0))

  // Initialize MCP
  useEffect(() => {
    const initializeMCP = async () => {
      const mcpStore = useMCPStore.getState()
      if (!mcpStore.isInitialized && !mcpStore.isInitializing) {
        await mcpStore.initialize()
      }
    }
    initializeMCP()
  }, [])

  // Load initial data
  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  // Load messages when session changes
  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession)
    }
  }, [currentSession, loadMessages])

  // Server status polling
  useEffect(() => {
    const checkAgentStatus = async () => {
      try {
        const mcpStore = useMCPStore.getState()
        setIsAgentReady(mcpStore.isInitialized)
        setServers(Object.entries(mcpStore.serverStatus).map(([id, status]) => ({
          id,
          name: `Server ${id}`,
          status,
          tools: mcpStore.availableTools
            .filter(tool => tool.serverId === id)
            .map(tool => ({
              id: tool.toolId,
              name: tool.name,
              description: tool.description
            }))
        })))
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
  }, [setIsAgentReady, setServers])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <ChatLayout
      sidebar={
        <Sidebar
          sessions={sessions}
          onNewChat={createNewChat}
          onSelectSession={(session) => setCurrentSession(session.id)}
          currentSessionId={currentSession || ""}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      }
      toolsButton={
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ToolsDropdown
            servers={servers}
            onToolSelect={(serverId, toolId) => {
              const mcpStore = useMCPStore.getState()
              const tool = mcpStore.availableTools.find(
                t => t.serverId === serverId && t.toolId === toolId
              )
              if (tool) {
                sendMessage(`Use tool: ${tool.name}`)
              }
            }}
            isLoading={!isAgentReady}
          />
        </div>
      }
    >
      <ScrollArea 
        className="h-[calc(100vh-8rem)]" 
        ref={scrollAreaRef}
      >
        <div className="flex flex-col">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
      </ScrollArea>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-5xl px-4 py-4">
          <ChatInput
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const textarea = form.querySelector('textarea')
              if (textarea) {
                sendMessage(textarea.value)
              }
            }}
            isLoading={isLoading}
            isDisabled={!isAgentReady || !currentSession}
            placeholder={!isAgentReady ? "Initializing..." : "Type your message..."}
          />
          {error && (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          )}
        </div>
      </div>
    </ChatLayout>
  )
}

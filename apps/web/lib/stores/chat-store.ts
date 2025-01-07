import { create } from 'zustand'
import { Message, ChatSession, ChatStatus, Server } from '@/components/chat/types'
import { useMCPStore } from './mcp-store'

interface ChatState {
  messages: Message[]
  sessions: ChatSession[]
  currentSession: string | null
  status: ChatStatus
  error: string | null
  isLoading: boolean
  isAgentReady: boolean
  isSidebarOpen: boolean
  servers: Server[]
}

interface ChatActions {
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setSessions: (sessions: ChatSession[]) => void
  addSession: (session: ChatSession) => void
  setCurrentSession: (sessionId: string | null) => void
  setStatus: (status: ChatStatus) => void
  setError: (error: string | null) => void
  setIsLoading: (isLoading: boolean) => void
  setIsAgentReady: (isReady: boolean) => void
  setIsSidebarOpen: (isOpen: boolean) => void
  setServers: (servers: Server[]) => void
  sendMessage: (content: string) => Promise<void>
  createNewChat: () => Promise<void>
  loadMessages: (sessionId: string) => Promise<void>
  loadSessions: () => Promise<void>
  reset: () => void
}

const initialState: ChatState = {
  messages: [],
  sessions: [],
  currentSession: null,
  status: 'idle',
  error: null,
  isLoading: false,
  isAgentReady: false,
  isSidebarOpen: true,
  servers: []
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  ...initialState,

  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => 
    set((state) => ({ 
      messages: [...state.messages, message],
      sessions: state.sessions.map(session => 
        session.id === state.currentSession
          ? { ...session, lastMessage: message.content, timestamp: new Date() }
          : session
      )
    })),
  
  setSessions: (sessions) => set({ sessions }),
  
  addSession: (session) =>
    set((state) => ({
      sessions: [session, ...state.sessions],
    })),
  
  setCurrentSession: (sessionId) => set({ currentSession: sessionId }),
  
  setStatus: (status) => set({ status }),
  
  setError: (error) => set({ error }),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setIsAgentReady: (isReady) => set({ isAgentReady: isReady }),
  
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  setServers: (servers) => set({ servers }),
  
  sendMessage: async (content: string) => {
    const state = get()
    if (!content.trim() || state.isLoading || !state.isAgentReady || !state.currentSession) return

    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date()
    }

    set((state) => ({ 
      messages: [...state.messages, userMessage],
      isLoading: true 
    }))

    try {
      const mcpStore = useMCPStore.getState()
      const response = await mcpStore.processMessage(content)

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        sessions: state.sessions.map(session => 
          session.id === state.currentSession
            ? { ...session, lastMessage: content, timestamp: new Date() }
            : session
        )
      }))

      // Save messages to backend
      await fetch(`/api/chat/sessions/${state.currentSession}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [userMessage, assistantMessage] })
      })
    } catch (error) {
      console.error("Error processing message:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: error instanceof Error ? error.message : "An error occurred while processing your message.",
        timestamp: new Date()
      }
      set((state) => ({ 
        messages: [...state.messages, errorMessage],
        error: errorMessage.content
      }))
    } finally {
      set({ isLoading: false })
    }
  },

  createNewChat: async () => {
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

      set((state) => ({
        sessions: [newSession, ...state.sessions],
        currentSession: newSession.id,
        messages: []
      }))
    } catch (error) {
      console.error("Failed to create new chat:", error)
      set({ error: "Failed to create new chat" })
    }
  },

  loadMessages: async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}/messages`)
      if (!res.ok) throw new Error('Failed to load messages')
      const data = await res.json()
      
      set({ 
        messages: data.messages?.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })) || []
      })
    } catch (error) {
      console.error("Failed to load session messages:", error)
      set({ error: "Failed to load messages" })
    }
  },

  loadSessions: async () => {
    try {
      const res = await fetch('/api/chat/sessions')
      if (!res.ok) throw new Error('Failed to load sessions')
      const data = await res.json()
      
      const sessions = data.sessions?.map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp)
      })) || []

      set((state) => ({
        sessions,
        currentSession: sessions.length > 0 && !state.currentSession ? sessions[0].id : state.currentSession
      }))
    } catch (error) {
      console.error("Failed to load sessions:", error)
      set({ error: "Failed to load sessions" })
    }
  },

  reset: () => set(initialState),
})) 
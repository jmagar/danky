'use client'

import { create } from 'zustand'
import { type Message, type ChatSession, type ChatStatus } from '@/components/chat/types'

interface ChatStore {
  messages: Message[]
  sessions: ChatSession[]
  currentSession: string | null
  status: ChatStatus
  isInitializing: boolean
  isProcessing: boolean
  error: string | null
  addMessage: (message: Omit<Message, 'timestamp'>) => void
  sendMessage: (content: string) => Promise<void>
  initialize: () => Promise<void>
  createSession: () => void
  setCurrentSession: (sessionId: string) => void
  clearError: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  sessions: [],
  currentSession: null,
  status: 'idle',
  isInitializing: true,
  isProcessing: false,
  error: null,

  addMessage: (message) => {
    const timestamp = new Date()
    const newMessage = { ...message, timestamp }
    
    set((state) => ({
      messages: [...state.messages, newMessage],
      sessions: state.currentSession 
        ? state.sessions.map(session => 
            session.id === state.currentSession 
              ? { 
                  ...session, 
                  lastMessage: message.content,
                  timestamp 
                }
              : session
          )
        : state.sessions
    }))
  },

  sendMessage: async (content) => {
    set({ isProcessing: true, error: null, status: 'loading' })
    
    try {
      // Add user message
      get().addMessage({ role: 'user', content })
      
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content,
          sessionId: get().currentSession 
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send message')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Add assistant message
      get().addMessage({ role: 'assistant', content: data.response })
      set({ status: 'idle' })
    } catch (error) {
      console.error('Error processing message:', error)
      set({ 
        error: error instanceof Error ? error.message : String(error),
        status: 'error'
      })
      // Add error message to chat
      get().addMessage({ 
        role: 'assistant', 
        content: `Error: ${error instanceof Error ? error.message : String(error)}`
      })
    } finally {
      set({ isProcessing: false })
    }
  },

  initialize: async () => {
    set({ isInitializing: true, error: null, status: 'loading' })
    
    try {
      const response = await fetch('/api/chat')
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to initialize chat')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Initialize with any existing sessions
      if (data.sessions) {
        set({ 
          sessions: data.sessions,
          currentSession: data.sessions[0]?.id || null
        })
      }

      set({ isInitializing: false, status: 'idle' })
    } catch (error) {
      console.error('Error initializing chat:', error)
      set({ 
        isInitializing: false,
        error: error instanceof Error ? error.message : String(error),
        status: 'error'
      })
    }
  },

  createSession: () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      lastMessage: '',
      timestamp: new Date()
    }

    set((state) => ({
      sessions: [newSession, ...state.sessions],
      currentSession: newSession.id,
      messages: [] // Clear messages for new session
    }))
  },

  setCurrentSession: (sessionId) => {
    set({ currentSession: sessionId, messages: [] }) // Clear messages when switching sessions
    // TODO: Load messages for this session from the backend
  },

  clearError: () => {
    set({ error: null })
  }
}))
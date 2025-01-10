'use client'

import { create } from 'zustand'
import { type Message, type ChatSession, type ChatStatus, type ContentType } from '@/components/chat/types'
import { createMessage, listMessages } from '@/app/api/actions/chat'

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

// Helper to create a text content object
const createTextContent = (text: string): ContentType => ({
  type: 'text',
  content: text
})

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
    const content = Array.isArray(message.content)
      ? message.content
      : [createTextContent(String(message.content))]

    set((state) => ({
      messages: [...state.messages, { ...newMessage, content }],
      sessions: state.currentSession
        ? state.sessions.map(session =>
            session.id === state.currentSession
              ? {
                  ...session,
                  lastMessage: content[0].content,
                  timestamp
                }
              : session
          )
        : state.sessions
    }))
  },

  sendMessage: async (content) => {
    const { currentSession } = get()
    if (!currentSession) {
      set({ error: 'No active chat session' })
      return
    }

    set({ isProcessing: true, error: null, status: 'loading' })

    try {
      // Add user message to UI immediately
      get().addMessage({
        role: 'user',
        content: [createTextContent(content)]
      })

      // Send message to API
      const response = await createMessage({
        sessionId: currentSession,
        role: 'user',
        content: [createTextContent(content)]
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to send message')
      }

      // Add assistant message
      if (response.data.role === 'assistant') {
        get().addMessage({
          role: 'assistant',
          content: response.data.content
        })
      }

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
        content: [createTextContent(`Error: ${error instanceof Error ? error.message : String(error)}`)]
      })
    } finally {
      set({ isProcessing: false })
    }
  },

  initialize: async () => {
    set({ isInitializing: true, error: null, status: 'loading' })

    try {
      // Get initial messages if there's a current session
      const { currentSession } = get()
      if (currentSession) {
        const response = await listMessages(currentSession)

        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to load messages')
        }

        set({
          messages: response.data.messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.createdAt
          }))
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
    // Load messages for this session
    get().initialize()
  },

  clearError: () => {
    set({ error: null })
  }
}))

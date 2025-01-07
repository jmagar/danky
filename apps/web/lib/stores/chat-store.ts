'use client'

import { create } from 'zustand'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatStore {
  messages: ChatMessage[]
  isInitializing: boolean
  isProcessing: boolean
  error: string | null
  addMessage: (message: ChatMessage) => void
  sendMessage: (content: string) => Promise<void>
  initialize: () => Promise<void>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isInitializing: true,
  isProcessing: false,
  error: null,

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }))
  },

  sendMessage: async (content) => {
    set({ isProcessing: true, error: null })
    
    try {
      // Add user message
      get().addMessage({ role: 'user', content })
      
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Add assistant message
      get().addMessage({ role: 'assistant', content: data.response })
    } catch (error) {
      console.error('Error processing message:', error)
      set({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      set({ isProcessing: false })
    }
  },

  initialize: async () => {
    set({ isInitializing: true, error: null })
    
    try {
      const response = await fetch('/api/chat')
      
      if (!response.ok) {
        throw new Error('Failed to initialize chat')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      set({ isInitializing: false })
    } catch (error) {
      console.error('Error initializing chat:', error)
      set({ 
        isInitializing: false,
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }
}))
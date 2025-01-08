'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/lib/stores/chat-store'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ChatLayout } from '@/components/chat/chat-layout'
import { Sidebar } from '@/components/chat/sidebar'
import { type ChatSession, type Server } from '@/components/chat/types'
import { Alert, AlertDescription } from '@danky/ui'
import { AlertCircle } from 'lucide-react'

// Mock data for models - replace with real data later
const mockModels = [
  { id: 'gpt-4', name: 'GPT-4', isFavorite: true },
  { id: 'gpt-3.5', name: 'GPT-3.5', isFavorite: true },
  { id: 'claude-2', name: 'Claude 2', isFavorite: false },
  { id: 'llama-2', name: 'Llama 2', isFavorite: false },
]

export default function ChatPage() {
  const { 
    messages, 
    isInitializing, 
    isProcessing, 
    error, 
    initialize, 
    clearError 
  } = useChatStore()

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (isInitializing) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="h-full">
      <ChatLayout
        sidebar={
          <Sidebar
            models={mockModels}
            currentModel="claude-2"
            onModelSelect={() => {}}
            onToggleFavorite={() => {}}
            user={{
              name: "John Doe",
              email: "john@example.com",
              isAdmin: true,
            }}
          />
        }
      >
        <div className="flex h-full flex-col">
          {error && (
            <Alert variant="destructive" className="m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <button 
                  onClick={clearError}
                  className="ml-2 underline hover:no-underline"
                >
                  Dismiss
                </button>
              </AlertDescription>
            </Alert>
          )}
          <div className="flex-1 overflow-y-auto p-4">
            <ChatMessages messages={messages} />
          </div>
          <div className="border-t p-4">
            <ChatInput 
              isProcessing={isProcessing}
              servers={[]}
              onToolSelect={() => {}}
            />
          </div>
        </div>
      </ChatLayout>
    </div>
  )
}
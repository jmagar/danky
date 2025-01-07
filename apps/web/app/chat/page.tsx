'use client'

import { useEffect, useState } from 'react'
import { useChatStore } from '@/lib/stores/chat-store'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ChatLayout } from '@/components/chat/chat-layout'
import { Sidebar } from '@/components/chat/sidebar'
import { type ChatSession, type Server } from '@/components/chat/types'

// Mock data for models - replace with real data later
const mockModels = [
  { id: 'gpt-4', name: 'GPT-4', isFavorite: true },
  { id: 'gpt-3.5', name: 'GPT-3.5', isFavorite: true },
  { id: 'claude-2', name: 'Claude 2', isFavorite: false },
  { id: 'llama-2', name: 'Llama 2', isFavorite: false },
]

export default function ChatPage() {
  const { messages, isInitializing, isProcessing, error, initialize } = useChatStore()
  const [currentSessionId, setCurrentSessionId] = useState('')
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [servers, setServers] = useState<Server[]>([])
  const [currentModel, setCurrentModel] = useState('gpt-4')
  const [models, setModels] = useState(mockModels)

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const handleNewChat = () => {
    // TODO: Implement new chat functionality
  }

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id)
  }

  const handleToolSelect = (serverId: string, toolId: string) => {
    // TODO: Implement tool selection
  }

  const handleModelSelect = (modelId: string) => {
    setCurrentModel(modelId)
  }

  const handleToggleFavorite = (modelId: string) => {
    setModels(models.map(model => 
      model.id === modelId 
        ? { ...model, isFavorite: !model.isFavorite }
        : model
    ))
  }

  if (isInitializing) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <ChatLayout
        sidebar={
          <Sidebar
            models={models}
            currentModel={currentModel}
            onModelSelect={handleModelSelect}
            onToggleFavorite={handleToggleFavorite}
            user={{
              name: "John Doe",
              email: "john@example.com",
              isAdmin: true,
            }}
          />
        }
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <ChatMessages messages={messages} />
          </div>
          <div className="border-t p-4">
            <ChatInput 
              isProcessing={isProcessing}
              servers={servers}
              onToolSelect={handleToolSelect}
            />
          </div>
        </div>
      </ChatLayout>
    </div>
  )
} 
'use client'

import { useEffect, useState } from 'react'
import { useChatStore } from '@/lib/stores/chat-store'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ChatLayout } from '@/components/chat/chat-layout'
import { Sidebar } from '@/components/chat/sidebar'
import { type ChatSession, type Server } from '@/components/chat/types'

export default function ChatPage() {
  const { messages, isInitializing, isProcessing, error, initialize } = useChatStore()
  const [isOpen, setIsOpen] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState('')
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [servers, setServers] = useState<Server[]>([])

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
            sessions={sessions}
            onNewChat={handleNewChat}
            onSelectSession={handleSelectSession}
            currentSessionId={currentSessionId}
            isOpen={isOpen}
            _onToggle={() => setIsOpen(!isOpen)}
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
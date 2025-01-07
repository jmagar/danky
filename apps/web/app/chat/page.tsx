'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/lib/stores/chat-store'
import { ChatInput } from '../../components/chat/chat-input'
import { ChatMessages } from '../../components/chat/chat-messages'
import { LoadingSpinner } from '../../components/ui/loading-spinner'
import { ChatLayout } from '../../components/chat/chat-layout'
import { Sidebar } from '../../components/chat/sidebar'
import { ToolsDropdown } from '../../components/chat/tools-dropdown'

export default function ChatPage() {
  const { messages, isInitializing, isProcessing, error, initialize } = useChatStore()

  useEffect(() => {
    void initialize();
  }, []);

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <ChatLayout
      sidebar={<Sidebar />}
      toolsButton={<ToolsDropdown />}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages messages={messages} />
        </div>
        <div className="border-t p-4">
          <ChatInput isProcessing={isProcessing} />
        </div>
      </div>
    </ChatLayout>
  )
} 
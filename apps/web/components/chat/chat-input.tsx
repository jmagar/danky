'use client'

import { useState } from 'react'
import { useChatStore } from '@/lib/stores/chat-store'
import { Button, Textarea, buttonVariants } from '@danky/ui'
import { SendHorizontal, Loader2 } from 'lucide-react'
import { AttachmentButton } from './attachment-button'
import { ToolsDropdown } from './tools-dropdown'
import { type Server } from './types'
import { cn } from '@danky/ui'

interface ChatInputProps {
  isProcessing: boolean
  servers?: Server[]
  onToolSelect?: (serverId: string, toolId: string) => void
}

export function ChatInput({ 
  isProcessing,
  servers = [],
  onToolSelect = () => {},
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const sendMessage = useChatStore((state) => state.sendMessage)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isProcessing) return;

    const message = input.trim();
    setInput('');
    void sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
      <AttachmentButton />
      <div className="relative flex-1">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isProcessing}
          className="min-h-[48px] w-full resize-none rounded-lg pr-24"
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <ToolsDropdown
            servers={servers}
            onToolSelect={onToolSelect}
            isLoading={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className={cn(
              buttonVariants({ variant: 'default', size: 'icon' }),
              'h-8 w-8'
            )}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </div>
    </form>
  )
}
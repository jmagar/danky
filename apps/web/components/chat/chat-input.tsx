'use client'

import { useState } from 'react'
import { useChatStore } from '@/lib/stores/chat-store'
import { Button, Textarea } from '@danky/ui'
import { SendHorizontal, Loader2 } from 'lucide-react'

interface ChatInputProps {
  isProcessing: boolean
}

export function ChatInput({ isProcessing }: ChatInputProps) {
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
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={isProcessing}
        className="min-h-[48px] w-full resize-none rounded-lg pr-12"
      />
      <Button
        type="submit"
        size="icon"
        disabled={isProcessing || !input.trim()}
        className="absolute right-2 bottom-2 h-8 w-8"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendHorizontal className="h-4 w-4" />
        )}
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
} 
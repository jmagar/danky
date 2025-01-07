"use client"

import { Button, Textarea, cn } from "@danky/ui"
import { SendHorizontal, Loader2 } from "lucide-react"
import { useRef, useEffect, useState } from "react"

interface ChatInputProps {
  onSubmit: (e: React.FormEvent) => void
  isLoading?: boolean
  isDisabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSubmit,
  isLoading = false,
  isDisabled = false,
  placeholder = "Type your message..."
}: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = scrollHeight + "px"
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isDisabled || isLoading) return
    onSubmit(e)
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        className={cn(
          "min-h-[48px] w-full resize-none rounded-lg pr-12",
          "focus-visible:ring-1 focus-visible:ring-offset-0",
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
        rows={1}
      />
      <Button
        type="submit"
        size="icon"
        disabled={isDisabled || isLoading || !input.trim()}
        className={cn(
          "absolute right-1 top-1 h-[34px] w-[34px]",
          "bg-primary hover:bg-primary/90",
          "text-primary-foreground",
          "transition-opacity",
          (!input.trim() || isDisabled) && "opacity-50"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendHorizontal className="h-4 w-4" />
        )}
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
} 
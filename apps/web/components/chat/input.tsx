"use client"

import { Button, Textarea } from "@danky/ui"
import { SendHorizontal, Loader2 } from "lucide-react"
import { cn } from "@danky/ui/lib/utils"
import { useRef, useEffect } from "react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading?: boolean
  isDisabled?: boolean
  placeholder?: string
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  isDisabled = false,
  placeholder = "Type your message..."
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const adjustHeight = () => {
      textarea.style.height = "0"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }

    textarea.addEventListener("input", adjustHeight)
    adjustHeight()

    return () => textarea.removeEventListener("input", adjustHeight)
  }, [value])

  return (
    <form 
      onSubmit={onSubmit} 
      className="relative flex items-end"
    >
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "pr-12 min-h-[52px] max-h-[200px] resize-none rounded-lg",
          "focus-visible:ring-1 focus-visible:ring-offset-0",
          "scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20",
          isDisabled && "opacity-50"
        )}
        disabled={isDisabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSubmit(e)
          }
        }}
      />
      <Button 
        type="submit"
        size="icon"
        variant="ghost"
        className={cn(
          "absolute right-2 bottom-2 h-8 w-8",
          "transition-opacity duration-200",
          (!value.trim() || isDisabled) && "opacity-0"
        )}
        disabled={isDisabled || !value.trim() || isLoading}
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
'use client'

import * as React from 'react'
import { Button } from './button'
import { Textarea } from './textarea'
import { cn } from '../lib/utils'
import { SendHorizontal, Loader2 } from 'lucide-react'

interface FormMessageInputProps {
  action: (formData: FormData) => Promise<void>
  isLoading?: boolean
  isDisabled?: boolean
  placeholder?: string
}

export function FormMessageInput({
  action,
  isLoading = false,
  isDisabled = false,
  placeholder = 'Type your message...'
}: FormMessageInputProps) {
  const [input, setInput] = React.useState('')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = scrollHeight + 'px'
    }
  }, [input])

  const handleSubmit = async (formData: FormData) => {
    if (!input.trim() || isDisabled || isLoading) return
    await action(formData)
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <form ref={formRef} onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      handleSubmit(formData)
    }} className="relative">
      <Textarea
        ref={textareaRef}
        name="message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        className={cn(
          'min-h-[48px] w-full resize-none rounded-lg pr-12',
          'focus-visible:ring-1 focus-visible:ring-offset-0',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
        rows={1}
      />
      <Button
        type="submit"
        size="icon"
        disabled={isDisabled || isLoading || !input.trim()}
        className={cn(
          'absolute right-1 top-1 h-[34px] w-[34px]',
          'bg-primary hover:bg-primary/90',
          'text-primary-foreground',
          'transition-opacity',
          (!input.trim() || isDisabled) && 'opacity-50'
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

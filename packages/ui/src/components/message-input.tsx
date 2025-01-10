"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Textarea } from "./textarea";

export interface MessageInputProps {
  onSubmit?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
}

export function MessageInput({
  className,
  onSubmit,
  isLoading,
  placeholder = "Type a message...",
  ...props
}: MessageInputProps) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = React.useCallback(() => {
    if (!value.trim()) return;
    onSubmit?.(value);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [onSubmit, value]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      setValue(textarea.value);
    },
    []
  );

  return (
    <div className={cn("relative", className)}>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder={placeholder}
        className="resize-none pr-12"
        {...props}
      />
      <Button
        size="icon"
        variant="ghost"
        className="absolute bottom-1 right-1 h-8 w-8"
        onClick={handleSubmit}
        disabled={isLoading || !value.trim()}
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}

MessageInput.displayName = "MessageInput";

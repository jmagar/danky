"use client"

import { useState } from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  ScrollArea,
  Textarea,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
  ThemeToggle,
} from "@danky/ui"
import { SendHorizontal } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // TODO: Implement actual chat functionality
    const assistantMessage: Message = {
      role: "assistant",
      content: "This is a placeholder response. The actual chat functionality will be implemented soon.",
    }
    setMessages((prev) => [...prev, assistantMessage])
  }

  return (
    <main className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        {/* Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <Card className="h-full rounded-none border-0">
            <CardHeader>
              <CardTitle>Danky AI Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full justify-start">
                + New Chat
              </Button>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle />

        {/* Main Chat Area */}
        <ResizablePanel defaultSize={80}>
          <Card className="h-full rounded-none border-0">
            <CardContent className="flex h-full flex-col p-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === "assistant" && (
                        <Avatar>
                          <AvatarImage src="/bot-avatar.png" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <Card className={`max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : ""}`}>
                        <CardContent className="p-3">
                          {message.content}
                        </CardContent>
                      </Card>
                      {message.role === "user" && (
                        <Avatar>
                          <AvatarImage src="/avatar.png" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="min-h-[60px] flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!input.trim()}>
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}

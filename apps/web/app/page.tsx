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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@danky/ui"
import { SendHorizontal, Settings, Plus, History, Trash2, MoreVertical, Copy, Share2, PanelLeftClose, PanelLeft } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "General Chat",
      lastMessage: "Hello! How can I help you today?",
      timestamp: new Date(),
    },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // TODO: Implement actual chat functionality
    const assistantMessage: Message = {
      role: "assistant",
      content: "This is a placeholder response. The actual chat functionality will be implemented soon.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])
  }

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      lastMessage: "Start a new conversation",
      timestamp: new Date(),
    }
    setChatSessions((prev) => [newSession, ...prev])
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <main className="flex h-screen items-center justify-center bg-background/95 p-4">
      <div className="relative flex h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[1800px] overflow-hidden rounded-lg border bg-background shadow-lg">
        <ResizablePanelGroup direction="horizontal">
          {/* Sidebar */}
          <ResizablePanel 
            defaultSize={20} 
            minSize={5} 
            maxSize={30}
            collapsible
            collapsedSize={5}
            collapsed={isCollapsed}
            onCollapse={setIsCollapsed}
          >
            <Card className="h-full rounded-none border-0 bg-muted/50">
              {isCollapsed ? (
                <CardContent className="p-4">
                  <div className="flex flex-col items-center gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setIsCollapsed(false)}
                          >
                            <PanelLeft className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Show conversations</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <ThemeToggle />
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader className="border-b bg-card px-6">
                    <div className="flex items-center justify-between">
                      <CardTitle>Danky AI Chat</CardTitle>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setIsCollapsed(true)}
                              >
                                <PanelLeftClose className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Hide conversations</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Settings</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={handleNewChat}
                    >
                      <Plus className="h-4 w-4" />
                      New Chat
                    </Button>

                    <ScrollArea className="h-[calc(100vh-280px)]">
                      {chatSessions.map((session) => (
                        <Card key={session.id} className="mb-2 bg-card">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                <span className="font-medium">{session.title}</span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share Chat
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Link
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Chat
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground truncate">
                              {session.lastMessage}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </ScrollArea>

                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <ThemeToggle />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Avatar>
                              <AvatarImage src="/avatar.png" />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuItem>Profile</DropdownMenuItem>
                          <DropdownMenuItem>Settings</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Chat Area */}
          <ResizablePanel defaultSize={80}>
            <Card className="h-full rounded-none border-0">
              <CardContent className="flex h-full flex-col p-0">
                {/* Messages Area */}
                <ScrollArea className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12">
                  <div className="mx-auto max-w-3xl py-6">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-6 flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className="flex items-start gap-3 max-w-[85%]">
                          {message.role === "assistant" && (
                            <Avatar>
                              <AvatarImage src="/bot-avatar.png" />
                              <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col gap-1">
                            <Card className={`${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                              <CardContent className="p-3">
                                {message.content}
                              </CardContent>
                            </Card>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          {message.role === "user" && (
                            <Avatar>
                              <AvatarImage src="/avatar.png" />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t bg-card/50">
                  <form onSubmit={handleSubmit} className="mx-auto max-w-3xl p-4 sm:p-6 md:p-8">
                    <div className="flex gap-2">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="min-h-[60px] flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit(e)
                          }
                        }}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button type="submit" size="icon" disabled={!input.trim()}>
                              <SendHorizontal className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Send message (Enter)</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  )
}

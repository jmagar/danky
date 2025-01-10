import { type MessageRole } from '@danky/schema'

export type ContentType =
  | { type: 'text'; content: string }
  | { type: 'code'; content: string; language: string; fileName?: string; lineNumbers?: boolean }
  | { type: 'image'; content: string; mimeType: string; width?: number; height?: number; altText?: string }
  | { type: 'file'; content: string; mimeType: string; fileName: string; fileSize: number; checksum?: string }

export interface Message {
  role: MessageRole
  content: ContentType[]
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export interface Tool {
  id: string
  name: string
  description: string
  category?: string
  icon?: string
}

export interface Server {
  id: string
  name: string
  status: "connected" | "disconnected" | "error"
  tools: Tool[]
  error?: string
}

export type ChatStatus = "idle" | "loading" | "error"

export interface ChatState {
  messages: Message[]
  sessions: ChatSession[]
  currentSession: string | null
  status: ChatStatus
  error: string | null
}

export interface ChatAction {
  type:
    | "SET_MESSAGES"
    | "ADD_MESSAGE"
    | "SET_SESSIONS"
    | "ADD_SESSION"
    | "SET_CURRENT_SESSION"
    | "SET_STATUS"
    | "SET_ERROR"
  payload: unknown
}

import { NextResponse } from 'next/server'
import { z } from 'zod'

// In-memory storage for development
const messagesBySession: Record<string, Array<{
  role: "user" | "assistant"
  content: string
  timestamp: Date
}>> = {}

// Initialize with some test data
messagesBySession["1"] = [
  {
    role: "assistant",
    content: "Hello! How can I help you today?",
    timestamp: new Date()
  }
]

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string()
})

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = await Promise.resolve(params.sessionId)
    const messages = messagesBySession[sessionId] || []
    
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = await Promise.resolve(params.sessionId)
    const body = await request.json()
    const { role, content } = messageSchema.parse(body)
    
    if (!messagesBySession[sessionId]) {
      messagesBySession[sessionId] = []
    }
    
    const message = {
      role,
      content,
      timestamp: new Date()
    }
    
    messagesBySession[sessionId].push(message)
    
    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Message store (temporary until we implement proper storage)
const messagesBySession: Record<string, Array<{
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}>> = {}

// Initialize with some test data
messagesBySession["1"] = [
  {
    id: crypto.randomUUID(),
    role: "assistant",
    content: "Hello! How can I help you today?",
    timestamp: new Date()
  }
]

// Validate session ID
const paramsSchema = z.object({
  sessionId: z.string().min(1)
})

// Validate message data
const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1)
})

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Validate params
    const { sessionId } = paramsSchema.parse(params)
    
    // Get messages for session
    const messages = messagesBySession[sessionId] || []
    
    return NextResponse.json({ 
      messages: messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid session ID' }, 
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Validate params
    const { sessionId } = paramsSchema.parse(params)
    
    // Validate request body
    const body = await request.json()
    const message = messageSchema.parse(body)
    
    // Initialize session messages if needed
    if (!messagesBySession[sessionId]) {
      messagesBySession[sessionId] = []
    }
    
    // Create new message with ID and timestamp
    const newMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }
    
    // Add message
    messagesBySession[sessionId].push(newMessage)
    
    return NextResponse.json({ 
      message: {
        ...newMessage,
        timestamp: newMessage.timestamp.toISOString()
      }
    })
  } catch (error) {
    console.error('Error adding message:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid message data', details: error.errors }, 
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    )
  }
} 
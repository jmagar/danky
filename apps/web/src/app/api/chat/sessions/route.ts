import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// In-memory storage for development
const sessions: Array<{
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}> = [
  {
    id: "1",
    title: "General Chat",
    lastMessage: "Hello! How can I help you today?",
    timestamp: new Date()
  }
]

const createSessionSchema = z.object({
  title: z.string(),
  lastMessage: z.string()
})

export async function GET(_request: NextRequest) {
  return NextResponse.json({ 
    sessions: sessions.map(session => ({
      ...session,
      timestamp: session.timestamp.toISOString()
    }))
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, lastMessage } = createSessionSchema.parse(body)
    
    const session = {
      id: Date.now().toString(),
      title,
      lastMessage,
      timestamp: new Date()
    }
    
    sessions.unshift(session)
    
    return NextResponse.json({ 
      sessionId: session.id,
      session: {
        ...session,
        timestamp: session.timestamp.toISOString()
      }
    })
  } catch (error) {
    console.error("Error creating session:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    )
  }
} 
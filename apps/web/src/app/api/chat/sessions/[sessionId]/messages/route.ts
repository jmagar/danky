import { type NextRequest } from 'next/server'
import { z } from 'zod'

// Mock data for development
const messages = [
  {
    id: "1",
    content: "Hello!",
    role: "user",
    timestamp: new Date().toISOString()
  }
]

const sessionParamsSchema = z.object({
  sessionId: z.string()
})

type RouteContext = {
  params: Promise<{ sessionId: string }>
}

export async function GET(
  request: Request,
  context: RouteContext
): Promise<Response> {
  try {
    const { sessionId } = await context.params
    sessionParamsSchema.parse({ sessionId })
    
    // Mock response for development
    return Response.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid session ID", details: error.errors },
        { status: 400 }
      )
    }
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

const messageSchema = z.object({
  content: z.string(),
  role: z.enum(["user", "assistant"])
})

export async function POST(
  request: Request,
  context: RouteContext
): Promise<Response> {
  try {
    const { sessionId } = await context.params
    sessionParamsSchema.parse({ sessionId })
    
    const body = await request.json()
    const message = messageSchema.parse(body)
    
    // Mock response for development
    return Response.json({
      message: {
        ...message,
        id: Math.random().toString(),
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("Error adding message:", error)
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid message", details: error.errors },
        { status: 400 }
      )
    }
    return Response.json(
      { error: "Failed to add message" },
      { status: 500 }
    )
  }
}
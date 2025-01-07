import { NextResponse } from 'next/server'
import { z } from 'zod'

// Mock server data for development
const servers = [
  {
    id: "1",
    name: "Local Server",
    status: "connected" as const,
    tools: [
      {
        id: "1",
        name: "Code Search",
        description: "Search through your codebase"
      },
      {
        id: "2",
        name: "File Editor",
        description: "Edit files in your workspace"
      }
    ]
  }
]

const messageSchema = z.object({
  message: z.string(),
  sessionId: z.string()
})

export async function GET() {
  return NextResponse.json({
    status: "ready",
    servers
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, sessionId } = messageSchema.parse(body)
    
    // Mock response for development
    return NextResponse.json({
      response: `I received your message: "${message}" in session ${sessionId}`
    })
  } catch (error) {
    console.error("Error processing message:", error)
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
} 
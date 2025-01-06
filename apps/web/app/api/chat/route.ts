import { MCPService } from '@/lib/services/mcp-service'
import { NextResponse } from 'next/server'

// Singleton instance
let mcpService: MCPService | null = null

async function ensureService() {
  if (!mcpService) {
    mcpService = new MCPService({ logLevel: 'info' })
    await mcpService.initialize()
  }
  return mcpService
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const service = await ensureService()
    const response = await service.processMessage(message)
    return NextResponse.json({ response })

  } catch (error) {
    console.error('Error processing message:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const service = await ensureService()
    return NextResponse.json({ 
      status: 'ready',
      servers: service.getServerStatus()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Service not ready' },
      { status: 500 }
    )
  }
} 
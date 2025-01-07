import { NextResponse } from 'next/server'
import { createLogger } from '@danky/mcp'
import { getMCPService } from '@/lib/services/mcp-provider'

const logger = createLogger({ level: 'info' })

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const service = await getMCPService()
    const response = await service.processMessage(message)
    
    return NextResponse.json({ response })
  } catch (error) {
    logger.error('Error processing message:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const service = await getMCPService()
    await service.initialize()
    
    return NextResponse.json({ status: 'ready' })
  } catch (error) {
    logger.error('Error initializing chat:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
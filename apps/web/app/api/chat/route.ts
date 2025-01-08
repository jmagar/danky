import { NextResponse } from 'next/server'
import { createLogger } from '@danky/mcp'
import { MCPService } from '@danky/mcp'
import path from 'path'

const logger = createLogger({ level: 'debug' })
const mcpService = new MCPService({
  configPath: path.join(process.cwd(), '../../mcp-config.json5'),
  logger
})

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    if (!message || typeof message !== 'string') {
      logger.error('Invalid message format:', { message })
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      )
    }

    logger.debug('Processing message:', { message })
    const response = await mcpService.processMessage(message)
    logger.debug('Response:', { response })
    
    return NextResponse.json({ response })
  } catch (error) {
    logger.error('Error processing message:', {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : String(error)
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    logger.debug('Initializing MCP service')
    await mcpService.initialize()
    logger.debug('MCP service initialized')
    
    return NextResponse.json({ status: 'ready' })
  } catch (error) {
    logger.error('Error initializing chat:', {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : String(error)
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
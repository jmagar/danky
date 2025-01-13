import { WebSocketServer } from 'ws';
import type { WebSocket, Data } from 'ws';
import type { IncomingMessage, Server } from 'http';
import type { Duplex } from 'stream';
import { createLogger } from '@danky/logger';
import { redis } from '@danky/redis';

const logger = createLogger('websocket');

interface WebSocketMessage {
  type: string;
  payload: unknown;
}

const WS_OPEN = 1; // WebSocket.OPEN constant

export class SocketServer {
  private readonly wss: WebSocketServer;
  private readonly clients: Map<string, WebSocket>;

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.clients = new Map();

    this.wss.on('connection', this.handleConnection.bind(this));

    // Subscribe to Redis for pub/sub
    const sub = redis.duplicate();
    sub.subscribe('chat');
    sub.on('message', this.handleRedisMessage.bind(this));
  }

  private handleConnection(ws: WebSocket, req: IncomingMessage): void {
    const clientId = req.headers['x-client-id'] as string;
    this.clients.set(clientId, ws);

    ws.on('message', this.handleMessage.bind(this));
    ws.on('close', () => this.handleClose(clientId));
  }

  private handleRedisMessage(_channel: string, message: string): void {
    this.broadcast(message);
  }

  private handleMessage(data: Data): void {
    try {
      const message = JSON.parse(data.toString()) as WebSocketMessage;
      logger.debug({ message }, 'Received WebSocket message');
      // Handle different message types
    } catch (error) {
      logger.error({ error }, 'Failed to handle WebSocket message');
    }
  }

  private handleClose(clientId: string): void {
    this.clients.delete(clientId);
    logger.info({ clientId }, 'Client disconnected');
  }

  private broadcast(message: string): void {
    this.clients.forEach(client => {
      if (client.readyState === WS_OPEN) {
        client.send(message);
      }
    });
  }

  public attach(server: Server): void {
    server.on('upgrade', async (request: IncomingMessage, socket: Duplex, head: Buffer) => {
      const shouldHandle = await this.wss.shouldHandle(request);
      if (shouldHandle) {
        this.wss.handleUpgrade(request, socket, head, ws => {
          this.wss.emit('connection', ws, request);
        });
      }
    });
  }
}

// Export singleton instance
export const wsServer = new SocketServer();

import { createLogger } from '@danky/logger';

const logger = createLogger('websocket-client');

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private messageHandlers = new Set<(data: unknown) => void>();

  constructor(private url: string) {}

  public connect() {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      logger.error({ error }, 'Failed to connect to WebSocket');
    }
  }

  private handleOpen() {
    logger.info('WebSocket connected');
    this.reconnectAttempts = 0;
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(data));
    } catch (error) {
      logger.error({ error }, 'Failed to handle WebSocket message');
    }
  }

  private handleClose() {
    logger.info('WebSocket closed');
    this.attemptReconnect();
  }

  private handleError(error: Event) {
    logger.error({ error }, 'WebSocket error');
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        logger.info({ attempt: this.reconnectAttempts }, 'Attempting to reconnect');
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  public send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  public onMessage(handler: (data: unknown) => void) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  public disconnect() {
    this.ws?.close();
  }
}

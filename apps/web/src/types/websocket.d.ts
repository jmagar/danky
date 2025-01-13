declare type WebSocketMessage = {
  type: string;
  payload: unknown;
};

declare type WebSocketHandler = (data: unknown) => void;

declare type WebSocketClientConfig = {
  url: string;
  maxReconnectAttempts?: number;
  reconnectTimeout?: number;
};

declare type WebSocketServerConfig = {
  noServer?: boolean;
  path?: string;
};

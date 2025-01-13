import type { IncomingMessage } from 'http';

declare module 'ws' {
  import { EventEmitter } from 'events';
  import { Duplex } from 'stream';

  export interface WebSocket extends EventEmitter {
    binaryType: string;
    readonly bufferedAmount: number;
    readonly extensions: string;
    readonly protocol: string;
    readonly readyState: number;
    readonly url: string;

    close(code?: number, data?: string | Buffer): void;
    ping(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
    pong(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
    send(data: any, cb?: (err?: Error) => void): void;
    terminate(): void;
  }

  export interface WebSocketServer extends EventEmitter {
    options: ServerOptions;
    path: string;
    clients: Set<WebSocket>;

    close(cb?: (err?: Error) => void): void;
    handleUpgrade(
      request: IncomingMessage,
      socket: Duplex,
      upgradeHead: Buffer,
      callback: (client: WebSocket, request: IncomingMessage) => void
    ): void;
    shouldHandle(request: IncomingMessage): boolean | Promise<boolean>;
  }

  export interface ServerOptions {
    host?: string;
    port?: number;
    backlog?: number;
    server?: any;
    verifyClient?: VerifyClientCallbackAsync | VerifyClientCallbackSync;
    handleProtocols?: any;
    path?: string;
    noServer?: boolean;
    clientTracking?: boolean;
    perMessageDeflate?: boolean;
    maxPayload?: number;
  }

  export type VerifyClientCallbackAsync = (
    info: { origin: string; secure: boolean; req: IncomingMessage },
    callback: (res: boolean, code?: number, message?: string) => void
  ) => void;

  export type VerifyClientCallbackSync = (info: {
    origin: string;
    secure: boolean;
    req: IncomingMessage;
  }) => boolean;

  export default class WS extends WebSocket {
    static readonly CONNECTING: 0;
    static readonly OPEN: 1;
    static readonly CLOSING: 2;
    static readonly CLOSED: 3;

    static Server: typeof WebSocketServer;
    static WebSocket: typeof WebSocket;
    static createWebSocketStream: any;
  }
}

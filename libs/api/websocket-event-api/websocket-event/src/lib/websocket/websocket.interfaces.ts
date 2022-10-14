import { WebSocket } from 'ws';

export interface WsEvent {
  topic: string;
  data: unknown;
}

export interface ExtendedWebSocket extends WebSocket {
  id: string;
  pingIntervalTimer: NodeJS.Timer;
  pingTimeoutTimer: NodeJS.Timer;
}

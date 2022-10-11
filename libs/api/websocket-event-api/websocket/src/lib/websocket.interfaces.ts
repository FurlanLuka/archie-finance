import { WebSocket } from 'ws';

export interface ActiveClient {
  userId: string;
  client: WebSocket;
}

export interface WsEvent {
  subject: string;
  data: unknown;
}

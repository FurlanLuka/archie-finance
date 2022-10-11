import { WebSocket } from 'ws';

export interface ActiveClient {
  userId: string;
  client: WebSocket;
}

import { WebSocketGateway } from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { IncomingMessage } from 'http';
import { WebsocketService } from './websocket.service';
import * as queryString from 'query-string';
import { Logger } from '@nestjs/common';
import { WebSocket, WebSocketServer } from 'ws';
import { ExtendedWebSocket } from './websocket.interfaces';

const PING_INTERVAL_IN_MS = 25_000;
const PING_TIMEOUT_IN_MS = 15_000;

@WebSocketGateway({
  transports: ['websocket'],
  pingInterval: PING_INTERVAL_IN_MS,
  pingTimeout: PING_TIMEOUT_IN_MS,
})
export class WebsocketGateway implements NestGateway {
  constructor(private websocketService: WebsocketService) {}

  afterInit(_server: WebSocketServer): void {
    // Nothing to do
  }

  handleDisconnect(client: ExtendedWebSocket): void {
    this.websocketService.handleWsConnectionDisconnect(client);
  }

  async handleConnection(
    client: ExtendedWebSocket,
    message: IncomingMessage,
    ..._args: any[]
  ): Promise<void> {
    const parsedUrl = (<string>message.url).replace('/', '').replace('?', '');
    const queryParams = queryString.parse(parsedUrl);

    if (
      queryParams.authToken === undefined ||
      typeof queryParams.authToken !== 'string'
    ) {
      Logger.warn('Invalid websocket connection request');
      client.terminate();
      return;
    }

    await this.websocketService.handleWsConnectionRequest(
      queryParams.authToken,
      client,
    );
  }
}

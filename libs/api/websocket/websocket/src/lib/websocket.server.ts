import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from '@nestjs/microservices';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Client } from '@nestjs/microservices/external/nats-client.interface';
import { IncomingMessage } from 'http';
import { WebsocketService } from './websocket.service';
import * as queryString from 'query-string';
import { Logger } from '@nestjs/common';

const PING_INTERVAL_IN_MS = 30000;
const PING_TIMEOUT_IN_MS = 5000;

@WebSocketGateway({
  transports: ['websocket'],
  pingInterval: PING_INTERVAL_IN_MS,
  pingTimeout: PING_TIMEOUT_IN_MS,
  httpCompression: true,
  // cors: {},
})
export class WebsocketServer implements NestGateway {
  constructor(private websocketService: WebsocketService) {}

  @WebSocketServer()
  server: Server;

  afterInit(_server: Server): void {}

  async handleDisconnect(client: Client): Promise<void> {
    await this.websocketService.handleWsConnectionDisconnect(client);
  }

  async handleConnection(
    client: Client,
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
      await client.close();
      return;
    }

    await this.websocketService.handleWsConnectionRequest(
      queryParams.authToken,
      client,
    );
  }
}

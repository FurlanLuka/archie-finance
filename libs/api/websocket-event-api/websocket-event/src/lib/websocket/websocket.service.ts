import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@archie-microservices/api/utils/redis';
import { CryptoService } from '@archie/api/utils/crypto';
import { AuthTokenDto } from '@archie/api/websocket-event-api/data-transfer-objects';
import { ActiveClient, WsEvent } from './websocket.interfaces';
import { WebSocket } from 'ws';
import { SERVICE_INSTANCE_ID } from '@archie/api/websocket-event-api/constants';

@Injectable()
export class WebsocketService {
  AUTH_TOKEN_BYTE_SIZE = 16;
  AUTH_EXPIRY_SECONDS = 30;
  activeClients: ActiveClient[] = [];
  clientToUserId: Map<WebSocket, string>;
  userToClient: Map<string, WebSocket>;

  constructor(
    private redisService: RedisService,
    private cryptoService: CryptoService,
  ) {}

  public async createAuthToken(userId: string): Promise<AuthTokenDto> {
    const authToken = this.cryptoService
      .randomBytes(this.AUTH_TOKEN_BYTE_SIZE)
      .toString('hex');

    await this.redisService.setWithExpiry(
      authToken,
      userId,
      this.AUTH_EXPIRY_SECONDS,
    );

    return {
      authToken,
    };
  }

  public handleWsConnectionDisconnect(client: WebSocket): void {
    const userId = this.clientToUserId.get(client);
    this.clientToUserId.delete(client);
    if (userId !== undefined) this.userToClient.delete(userId);

    Logger.log({
      serviceInstanceId: SERVICE_INSTANCE_ID,
      message: `Number of active clients: ${this.activeClients.length}`,
    });
  }

  public async handleWsConnectionRequest(
    authToken: string,
    client: WebSocket,
  ): Promise<void> {
    const userId: string | null =
      (await this.redisService.getAndDelete(authToken)) ?? 'dummy';

    if (userId === null) {
      Logger.warn('Invalid websocket connection token');
      client.terminate();

      return;
    }

    this.userToClient.set(userId, client);
    this.clientToUserId.set(client, userId);

    Logger.log({
      serviceInstanceId: SERVICE_INSTANCE_ID,
      message: `Number of active clients: ${this.activeClients.length}`,
    });
  }

  public publish(userId: string, event: WsEvent): void {
    const userClient: WebSocket | undefined = this.userToClient.get(userId);

    if (userClient === undefined) {
      return;
    }

    userClient.send(JSON.stringify(event));
    userClient.emit('event_sent');
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@archie-microservices/api/utils/redis';
import { CryptoService } from '@archie/api/utils/crypto';
import { AuthTokenDto } from '@archie/api/websocket/data-transfer-objects';
import { ActiveClient, WsEvent } from './websocket.interfaces';
import { WebSocket } from 'ws';

@Injectable()
export class WebsocketService {
  AUTH_TOKEN_BYTE_SIZE = 16;
  activeClients: ActiveClient[] = [];

  constructor(
    private redisService: RedisService,
    private cryptoService: CryptoService,
  ) {}

  public async createAuthToken(userId: string): Promise<AuthTokenDto> {
    const authToken = this.cryptoService
      .randomBytes(this.AUTH_TOKEN_BYTE_SIZE)
      .toString('hex');

    await this.redisService.setWithExpiry(authToken, userId);

    return {
      authToken,
    };
  }

  public handleWsConnectionDisconnect(client: WebSocket): void {
    this.activeClients = this.activeClients.filter(
      (activeClient: ActiveClient) => activeClient.client !== client,
    );

    Logger.log(`Number of active clients: ${this.activeClients.length}`);
  }

  public async handleWsConnectionRequest(
    authToken: string,
    client: WebSocket,
  ): Promise<void> {
    const userId: string | null = await this.redisService.getAndDelete(
      authToken,
    );

    if (userId === null) {
      Logger.warn('Invalid websocket connection token');
      client.terminate();

      return;
    }

    this.activeClients.push({ userId, client });

    Logger.log(`Number of active clients: ${this.activeClients.length}`);
  }

  public handleWsPublish(userId: string, event: WsEvent): void {
    const userClient = this.activeClients.find((c) => c.userId === userId);

    if (!userClient) {
      return;
    }

    userClient.client.send(JSON.stringify(event.data));
  }
}

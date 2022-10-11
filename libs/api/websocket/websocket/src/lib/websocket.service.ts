import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@archie-microservices/api/utils/redis';
import { CryptoService } from '@archie/api/utils/crypto';
import { AuthTokenDto } from '@archie/api/websocket/data-transfer-objects';
import { Client } from '@nestjs/microservices/external/nats-client.interface';
import { ActiveClient, WsEvent } from './websocket.interfaces';

@Injectable()
export class WebsocketService {
  AUTH_TOKEN_BYTE_SIZE = 16;
  activeClients: ActiveClient[] = [];

  constructor(
    private redisService: RedisService,
    private cryptoService: CryptoService,
  ) {
    setInterval(
      function ping() {
        this.activeClients.forEach(function each(ws) {
          console.log('periodic', ws);
          if (ws.client.isAlive === false) return ws.client.terminate();

          ws.client.isAlive = false;
          ws.client.ping();
        });
      }.bind(this),
      20_000,
    );
  }

  public async createAuthToken(userId: string): Promise<AuthTokenDto> {
    const authToken = this.cryptoService
      .randomBytes(this.AUTH_TOKEN_BYTE_SIZE)
      .toString('hex');

    await this.redisService.setWithExpiry(authToken, userId);

    return {
      authToken,
    };
  }

  public async handleWsConnectionDisconnect(client: Client): Promise<void> {
    this.activeClients = this.activeClients.filter(
      (activeClient: ActiveClient) => activeClient.client !== client,
    );

    Logger.log(`Number of active clients: ${this.activeClients.length}`);
  }

  public async handleWsConnectionRequest(
    authToken: string,
    client: any,
  ): Promise<void> {
    const userId: string | null = await this.redisService.getAndDelete(
      authToken,
    );

    if (userId === null) {
      Logger.warn('Invalid websocket connection token');
      await client.close();

      return;
    }

    this.activeClients.push({ userId, client });

    client.on('ping', (a) => {
      console.log('ping', a);
    });
    client.on('pong', (a) => {
      console.log('pong');
      client.isAlive = true;
    });

    Logger.log(`Number of active clients: ${this.activeClients.length}`);
  }

  public handlePublish(userId: string, event: WsEvent): void {
    const userClient = this.activeClients.find((c) => c.userId === userId);

    if (!userClient) {
      return;
    }

    userClient.client.publish(
      event.subject,
      Buffer.from(JSON.stringify(event.data)),
    );
  }
}

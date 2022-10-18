import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@archie-microservices/api/utils/redis';
import { CryptoService } from '@archie/api/utils/crypto';
import { AuthTokenDto } from '@archie/api/websocket-event-api/data-transfer-objects';
import { ExtendedWebSocket, WsEvent } from './websocket.interfaces';
import { SERVICE_INSTANCE_ID } from '@archie/api/websocket-event-api/constants';

@Injectable()
export class WebsocketService {
  AUTH_TOKEN_BYTE_SIZE = 16;
  AUTH_EXPIRY_SECONDS = 30;
  userClients: Map<string, ExtendedWebSocket[]> = new Map<
    string,
    ExtendedWebSocket[]
  >();
  clientUser: Map<string, string> = new Map<string, string>();

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

  public handleWsConnectionDisconnect(client: ExtendedWebSocket): void {
    const userId: string | undefined = this.clientUser.get(client.id);
    this.clientUser.delete(client.id);

    if (userId !== undefined) {
      const userClients: ExtendedWebSocket[] =
        this.userClients.get(userId) ?? [];

      const activeUserClients: ExtendedWebSocket[] = userClients.filter(
        (userClient) => userClient.id !== client.id,
      );

      if (activeUserClients.length === 0) {
        this.userClients.delete(userId);
      } else {
        this.userClients.set(userId, activeUserClients);
      }
    }

    Logger.log({
      serviceInstanceId: SERVICE_INSTANCE_ID,
      message: `Number of active clients: ${this.clientUser.size}`,
    });
  }

  public async handleWsConnectionRequest(
    authToken: string,
    client: ExtendedWebSocket,
  ): Promise<void> {
    const userId: string | null = await this.redisService.getAndDelete(
      authToken,
    );

    if (userId === null) {
      Logger.warn('Invalid websocket connection token');
      client.terminate();

      return;
    }

    this.addNewActiveClient(userId, client);

    Logger.log({
      serviceInstanceId: SERVICE_INSTANCE_ID,
      message: `Number of active clients: ${this.clientUser.size}`,
    });
  }

  private addNewActiveClient(userId: string, client: ExtendedWebSocket): void {
    const existingUserClients: ExtendedWebSocket[] =
      this.userClients.get(userId) ?? [];

    this.userClients.set(userId, [...existingUserClients, client]);
    this.clientUser.set(client.id, userId);
  }

  public publish(userId: string, event: WsEvent): void {
    const userClients: ExtendedWebSocket[] = this.userClients.get(userId) ?? [];

    userClients.forEach((client) => {
      client.send(JSON.stringify(event));
    });
  }
}

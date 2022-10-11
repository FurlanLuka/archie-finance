import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@archie-microservices/api/utils/redis';
import { CryptoService } from '@archie/api/utils/crypto';
import { AuthTokenDto } from '@archie/api/websocket/data-transfer-objects';
import { Client } from '@nestjs/microservices/external/nats-client.interface';

@Injectable()
export class WebsocketService {
  AUTH_TOKEN_SIZE = 32;
  activeClients: Record<string, Client>[] = [];

  constructor(
    private redisService: RedisService,
    private cryptoService: CryptoService,
  ) {}

  public async createAuthToken(userId: string): Promise<AuthTokenDto> {
    const authToken = this.cryptoService
      .randomBytes(this.AUTH_TOKEN_SIZE)
      .toString();

    await this.redisService.setWithExpiry(authToken, userId);

    return {
      authToken,
    };
  }

  public async handleWsConnectionRequest(
    authToken: string,
    client: Client,
  ): Promise<void> {
    const userId: string | null = await this.redisService.getAndDelete(
      authToken,
    );

    if (userId === null) {
      Logger.warn('Invalid token');
      await client.close();

      return;
    }

    this.activeClients.push({ [userId]: client });
  }
}

import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { HealthModule } from '@archie/api/utils/health';
import { Module } from '@nestjs/common';
import { ConfigVariables } from '@archie/api/websocket/constants';
import { QueueModule } from '@archie/api/utils/queue';
import { WebsocketModule } from '@archie/api/websocket/websocket';
import { RedisModule } from '@archie-microservices/api/utils/redis';
import { SERVICE_NAME } from '@archie/api/credit-api/constants';
import { CryptoModule } from '@archie/api/utils/crypto';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [ConfigVariables.QUEUE_URL],
    }),
    QueueModule.register(),
    HealthModule,
    WebsocketModule,
    CryptoModule.register(),
    RedisModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get(ConfigVariables.REDIS_URL),
        keyPrefix: SERVICE_NAME,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

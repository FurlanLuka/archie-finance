import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { HealthModule } from '@archie/api/utils/health';
import { Module } from '@nestjs/common';
import { ConfigVariables } from '@archie/api/websocket-event-api/constants';
import { QueueModule } from '@archie/api/utils/queue';
import {
  EventModule,
  WebsocketModule,
} from '@archie/api/websocket-event-api/websocket-event';
import { RedisModule } from '@archie-microservices/api/utils/redis';
import { SERVICE_NAME } from '@archie/api/credit-api/constants';
import { CryptoModule } from '@archie/api/utils/crypto';
import { AuthModule } from '@archie/api/utils/auth0';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.AUTH0_AUDIENCE,
        ConfigVariables.AUTH0_DOMAIN,
        ConfigVariables.QUEUE_URL,
        ConfigVariables.REDIS_URL,
      ],
    }),
    QueueModule.register(),
    HealthModule,
    CryptoModule.register(),
    AuthModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        domain: configService.get(ConfigVariables.AUTH0_DOMAIN),
        audience: configService.get(ConfigVariables.AUTH0_AUDIENCE),
      }),
      inject: [ConfigService],
    }),
    RedisModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get(ConfigVariables.REDIS_URL),
        keyPrefix: SERVICE_NAME,
      }),
      inject: [ConfigService],
    }),
    WebsocketModule,
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

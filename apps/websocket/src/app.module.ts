import { ConfigModule } from '@archie/api/utils/config';
import { HealthModule } from '@archie/api/utils/health';
import { Module } from '@nestjs/common';
import { ConfigVariables } from '@archie/api/websocket/constants';
import { QueueModule } from '@archie/api/utils/queue';
import { WebsocketModule } from '@archie/api/websocket/websocket';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [ConfigVariables.QUEUE_URL],
    }),
    QueueModule.register(),
    HealthModule,
    WebsocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { PeachWebhookModule } from '@archie/api/webhook-api/peach';
import { ConfigModule } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/webhook-api/constants';
import { QueueModule } from '@archie/api/utils/queue';
import { HealthModule } from '@archie/api/utils/health';
import { FireblocksWebhookModule } from '@archie/api/webhook-api/fireblocks';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.TYPEORM_HOST,
        ConfigVariables.TYPEORM_USERNAME,
        ConfigVariables.TYPEORM_PASSWORD,
        ConfigVariables.TYPEORM_DATABASE,
        ConfigVariables.QUEUE_URL,
        ConfigVariables.PEACH_BASE_URL,
        ConfigVariables.PEACH_API_KEY,
        ConfigVariables.FIREBLOCKS_PUBLIC_KEY,
      ],
    }),
    QueueModule.register(),
    PeachWebhookModule,
    FireblocksWebhookModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

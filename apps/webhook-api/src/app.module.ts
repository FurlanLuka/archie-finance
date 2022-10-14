import { Module } from '@nestjs/common';
import { PeachWebhookModule } from '@archie/api/webhook-api/peach';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import {
  ConfigVariables,
  SERVICE_NAME,
} from '@archie/api/webhook-api/constants';
import { migrations } from './migrations';
import { QueueModule } from '@archie/api/utils/queue';
import { HealthModule } from '@archie/api/utils/health';
import { FireblocksWebhookModule } from '@archie/api/webhook-api/fireblocks';
import { Auth0Module } from '@archie/api/webhook-api/auth0';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(ConfigVariables.TYPEORM_HOST),
        username: configService.get(ConfigVariables.TYPEORM_USERNAME),
        password: configService.get(ConfigVariables.TYPEORM_PASSWORD),
        database: configService.get(ConfigVariables.TYPEORM_DATABASE),
        port: configService.get(ConfigVariables.TYPEORM_PORT),
        synchronize: false,
        autoLoadEntities: true,
        keepConnectionAlive: true,
        migrationsRun:
          configService.get(ConfigVariables.RUN_MIGRATIONS) !== 'false',
        migrationsTableName: `${SERVICE_NAME}-migrations`,
        migrations: migrations,
      }),
      inject: [ConfigService],
    }),
    QueueModule.register(),
    PeachWebhookModule,
    FireblocksWebhookModule,
    HealthModule,
    Auth0Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

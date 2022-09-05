import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import {
  ConfigVariables,
  SERVICE_NAME,
} from '@archie/api/paypal-api/constants';
import { QueueModule } from '@archie/api/utils/queue';
import { HealthModule } from '@archie/api/utils/health';
import { PaypalModule } from '@archie/api/paypal-api/paypal'

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.TYPEORM_HOST,
        ConfigVariables.TYPEORM_USERNAME,
        ConfigVariables.TYPEORM_PASSWORD,
        ConfigVariables.TYPEORM_DATABASE,
        ConfigVariables.QUEUE_URL,
        ConfigVariables.PAYPAL_CLIENT_ID,
        ConfigVariables.PAYPAL_CLIENT_SECRET,
        ConfigVariables.PAYPAL_API_URL,
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
        migrationsRun: true,
        migrationsTableName: `${SERVICE_NAME}-migrations`,
      }),
      inject: [ConfigService],
    }),
    // QueueModule.register(),
    HealthModule,
    PaypalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

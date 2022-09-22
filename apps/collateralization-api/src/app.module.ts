import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { HealthModule } from '@archie/api/utils/health';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigVariables } from '@archie/api/collateralization-api/constants';
import { migrations } from './migrations';
import { QueueModule } from '@archie/api/utils/queue';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.TYPEORM_DATABASE,
        ConfigVariables.TYPEORM_HOST,
        ConfigVariables.TYPEORM_PASSWORD,
        ConfigVariables.TYPEORM_PORT,
        ConfigVariables.TYPEORM_USERNAME,
        ConfigVariables.QUEUE_URL,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: `postgres`,
        host: configService.get(ConfigVariables.TYPEORM_HOST),
        username: configService.get(ConfigVariables.TYPEORM_USERNAME),
        password: configService.get(ConfigVariables.TYPEORM_PASSWORD),
        database: configService.get(ConfigVariables.TYPEORM_DATABASE),
        port: configService.get(ConfigVariables.TYPEORM_PORT),
        synchronize: false,
        keepConnectionAlive: true,
        autoLoadEntities: true,
        migrations: migrations,
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
    QueueModule.register(),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

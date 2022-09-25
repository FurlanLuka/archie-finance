import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { HealthModule } from '@archie/api/utils/health';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigVariables } from '@archie/api/fireblocks-api/constants';
import { migrations } from './migrations';
import { QueueModule } from '@archie/api/utils/queue';
import { AssetsModule } from '@archie/api/fireblocks-api/assets';
import {
  DepositModule,
  VaultAccountModule,
} from '@archie/api/fireblocks-api/fireblocks';

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
    AssetsModule,
    DepositModule,
    VaultAccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

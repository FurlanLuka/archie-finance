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
  LiquidationModule,
  VaultAccountModule,
  WithdrawModule,
} from '@archie/api/fireblocks-api/fireblocks';
import { AuthModule } from '@archie/api/utils/auth0';

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
        ConfigVariables.FIREBLOCKS_API_KEY,
        ConfigVariables.FIREBLOCKS_PRIVATE_KEY,
        ConfigVariables.ASSET_LIST,
        ConfigVariables.AUTH0_AUDIENCE,
        ConfigVariables.AUTH0_DOMAIN,
      ],
      parse: (configVariable: ConfigVariables, value) => {
        if (configVariable === ConfigVariables.ASSET_LIST) {
          return JSON.parse(value);
        }

        return value;
      },
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
    AuthModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        domain: configService.get(ConfigVariables.AUTH0_DOMAIN),
        audience: configService.get(ConfigVariables.AUTH0_AUDIENCE),
      }),
      inject: [ConfigService],
    }),
    QueueModule.register(),
    HealthModule,
    AssetsModule,
    DepositModule,
    VaultAccountModule,
    WithdrawModule,
    LiquidationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

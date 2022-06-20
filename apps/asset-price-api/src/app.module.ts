import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { HealthModule } from '@archie-microservices/health';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigVariables } from './interfaces';
import { AssetPriceModule } from './modules/asset_price/asset_price.module';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.ASSET_LIST,
        ConfigVariables.COINAPI_KEY,
        ConfigVariables.COINAPI_WEBSOCKET_URI,
        ConfigVariables.TYPEORM_DATABASE,
        ConfigVariables.TYPEORM_HOST,
        ConfigVariables.TYPEORM_PASSWORD,
        ConfigVariables.TYPEORM_PORT,
        ConfigVariables.TYPEORM_USERNAME,
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
        synchronize: true,
        keepConnectionAlive: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AssetPriceModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

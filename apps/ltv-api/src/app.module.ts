import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables, SERVICE_NAME } from '@archie/api/ltv-api/constants';
import { HealthModule } from '@archie/api/utils/health';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from '@archie/api/utils/queue';
import { migrations } from './migrations';
import { AuthModule } from '@archie/api/utils/auth0';
import { LtvModule } from '@archie/api/ltv-api/ltv';
import { RedisModule } from '@archie-microservices/api/utils/redis';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.TYPEORM_HOST,
        ConfigVariables.TYPEORM_USERNAME,
        ConfigVariables.TYPEORM_PASSWORD,
        ConfigVariables.TYPEORM_DATABASE,
        ConfigVariables.QUEUE_URL,
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
        migrations: migrations,
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
    HealthModule,
    QueueModule.register(),
    LtvModule,
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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '@archie/api/credit/constants';
import { AuthModule } from '@archie-microservices/auth0';
import { HealthModule } from '@archie-microservices/health';
import { CreditModule } from './modules/credit/credit.module';
import { InternalApiModule } from '@archie-microservices/internal-api';
import { AptoModule } from './modules/apto/apto.module';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.AUTH0_AUDIENCE,
        ConfigVariables.AUTH0_DOMAIN,
        ConfigVariables.TYPEORM_HOST,
        ConfigVariables.TYPEORM_USERNAME,
        ConfigVariables.TYPEORM_PASSWORD,
        ConfigVariables.TYPEORM_DATABASE,
        ConfigVariables.INTERNAL_API_URL,
      ],
      parse: (_configVariable, value) => value,
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
        autoLoadEntities: true,
        keepConnectionAlive: true,
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
    InternalApiModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        internalApiUrl: configService.get(ConfigVariables.INTERNAL_API_URL),
      }),
    }),
    HealthModule,
    CreditModule,
    AptoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

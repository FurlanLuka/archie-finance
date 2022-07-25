import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/credit-api/constants';
import { AuthModule } from '@archie/api/utils/auth0';
import { HealthModule } from '@archie/api/utils/health';
import { CreditModule } from './modules/credit/credit.module';
import { InternalApiModule } from '@archie/api/utils/internal';
import { AptoModule } from './modules/apto/apto.module';
import { MarginModule } from './modules/margin/margin.module';
import { RizeModule } from './modules/rize/rize.module';
import { CollateralModule } from './modules/collateral/collateral.module';
import { CollateralWithdrawalModule } from './modules/collateral/withdrawal/collateral_withdrawal.module';

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
        ConfigVariables.RIZE_ENVIRONMENT,
        ConfigVariables.RIZE_PROGRAM_ID,
        ConfigVariables.RIZE_HMAC_KEY,
        ConfigVariables.RIZE_MQ_HOST,
        ConfigVariables.RIZE_MQ_PASSWORD,
        ConfigVariables.RIZE_MQ_USERNAME,
        ConfigVariables.RIZE_MQ_TOPIC_PREFIX,
        ConfigVariables.QUEUE_URL,
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
        synchronize: false,
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
    MarginModule,
    RizeModule,
    CollateralModule,
    CollateralWithdrawalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

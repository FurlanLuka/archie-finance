import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import {
  ConfigVariables,
  SERVICE_NAME,
} from '@archie/api/credit-api/constants';
import { AuthModule } from '@archie/api/utils/auth0';
import { HealthModule } from '@archie/api/utils/health';
import { CreditModule } from '@archie/api/credit-api/credit';
import { CollateralModule } from '@archie/api/credit-api/collateral';
import { RizeModule } from '@archie/api/credit-api/rize';
import { PlaidModule } from '@archie/api/credit-api/plaid';
import { MarginModule } from '@archie/api/credit-api/margin';
import { AptoModule } from '@archie/api/credit-api/apto';
import { CollateralWithdrawalModule } from '@archie/api/credit-api/collateral-withdrawal';
import { migrations } from './migrations';
import { QueueModule } from '@archie/api/utils/queue';
import { CryptoModule } from '@archie/api/utils/crypto';

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
        ConfigVariables.RIZE_ENVIRONMENT,
        ConfigVariables.RIZE_PROGRAM_ID,
        ConfigVariables.RIZE_HMAC_KEY,
        ConfigVariables.RIZE_MQ_HOST,
        ConfigVariables.RIZE_MQ_PASSWORD,
        ConfigVariables.RIZE_MQ_USERNAME,
        ConfigVariables.RIZE_MQ_TOPIC_PREFIX,
        ConfigVariables.QUEUE_URL,
        ConfigVariables.ENCRYPTION_KEY,
        ConfigVariables.PEACH_BORROWER_ROLE_ID,
        ConfigVariables.PEACH_COMPANY_ID,
        ConfigVariables.PEACH_API_KEY,
        ConfigVariables.PEACH_LOAN_ID,
        ConfigVariables.PEACH_BASE_URL,
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
    CryptoModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        encryptionKey: configService.get(ConfigVariables.ENCRYPTION_KEY),
      }),
    }),
    HealthModule,
    CreditModule,
    AptoModule,
    MarginModule,
    RizeModule,
    PlaidModule,
    CollateralModule,
    CollateralWithdrawalModule,
    QueueModule.register(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

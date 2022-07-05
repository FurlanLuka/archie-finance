import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '@archie/api/referral-system/constants';
import { HealthModule } from '@archie-microservices/health';
import { VaultModule } from '@archie-microservices/vault';
import { WaitlistModule } from './modules/waitlist/waitlist.module';
import { SendgridModule } from '@archie-microservices/sendgrid';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.TYPEORM_HOST,
        ConfigVariables.TYPEORM_USERNAME,
        ConfigVariables.TYPEORM_PASSWORD,
        ConfigVariables.TYPEORM_DATABASE,
        ConfigVariables.VAULT_NAMESPACE,
        ConfigVariables.VAULT_PASSWORD,
        ConfigVariables.VAULT_PRIVATE_ADDRESS,
        ConfigVariables.VAULT_USERNAME,
        ConfigVariables.SENDGRID_API_KEY,
        ConfigVariables.SENDGRID_MAILING_LIST_ID,
        ConfigVariables.SENDGRID_API_URL,
        ConfigVariables.SENDGRID_VERIFY_EMAIL_TEMPLATAE_ID,
        ConfigVariables.ARCHIE_MARKETING_WEBSITE_URL,
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
    VaultModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        VAULT_NAMESPACE: configService.get(ConfigVariables.VAULT_NAMESPACE),
        VAULT_PASSWORD: configService.get(ConfigVariables.VAULT_PASSWORD),
        VAULT_PRIVATE_ADDRESS: configService.get(
          ConfigVariables.VAULT_PRIVATE_ADDRESS,
        ),
        VAULT_USERNAME: configService.get(ConfigVariables.VAULT_USERNAME),
      }),
      inject: [ConfigService],
    }),
    SendgridModule.register({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        API_KEY: configService.get(ConfigVariables.SENDGRID_API_KEY),
        API_URL: configService.get(ConfigVariables.SENDGRID_API_URL),
        MAILING_LIST_ID: configService.get(
          ConfigVariables.SENDGRID_MAILING_LIST_ID,
        ),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    WaitlistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

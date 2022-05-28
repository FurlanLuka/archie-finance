import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycModule } from './modules/kyc/kyc.module';
import { UserModule } from './modules/user/user.module';
import { EmailWaitlistModule } from './modules/email_waitlist/email_waitlist.module';
import { DepositAddressModule } from './modules/deposit_address/deposit_address.module';
import { UserVaultAccountModule } from './modules/user_vault_account/user_vault_account.module';
import { OmnibusVaultAccountModule } from './modules/omnibus_vault_account/omnibus_vault_account.module';
import { FireblocksWebhookModule } from './modules/fireblocks_webhook/fireblocks_webhook.module';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from './interfaces';
import { AuthModule } from '@archie-microservices/auth0';
import { HealthModule } from '@archie-microservices/health';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.ASSET_LIST,
        ConfigVariables.AUTH0_AUDIENCE,
        ConfigVariables.AUTH0_DOMAIN,
        ConfigVariables.AUTH0_M2M_DOMAIN,
        ConfigVariables.AUTH0_M2M_CLIENT_SECRET,
        ConfigVariables.AUTH0_M2M_CLIENT_ID,
        ConfigVariables.TYPEORM_HOST,
        ConfigVariables.TYPEORM_USERNAME,
        ConfigVariables.TYPEORM_PASSWORD,
        ConfigVariables.TYPEORM_DATABASE,
        ConfigVariables.SENDGRID_API_KEY,
        ConfigVariables.SENDGRID_MAILING_LIST_ID,
        ConfigVariables.FIREBLOCKS_VAULT_ACCOUNT_ID,
        ConfigVariables.ASSET_LIST,
        ConfigVariables.FIREBLOCKS_API_KEY,
        ConfigVariables.FIREBLOCKS_PRIVATE_KEY,
        ConfigVariables.FIREBLOCKS_PUBLIC_KEY,
        ConfigVariables.VAULT_PRIVATE_ADDRESS,
        ConfigVariables.VAULT_USERNAME,
        ConfigVariables.VAULT_PASSWORD,
        ConfigVariables.VAULT_NAMESPACE,
      ],
      parse: (configVariable, value) => {
        if (configVariable === ConfigVariables.ASSET_LIST) {
          return JSON.parse(value);
        }

        return value;
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
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
    KycModule,
    HealthModule,
    UserModule,
    EmailWaitlistModule,
    DepositAddressModule,
    UserVaultAccountModule,
    OmnibusVaultAccountModule,
    FireblocksWebhookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositAddressModule } from './modules/deposit_address/deposit_address.module';
import { UserVaultAccountModule } from './modules/user_vault_account/user_vault_account.module';
import { OmnibusVaultAccountModule } from './modules/omnibus_vault_account/omnibus_vault_account.module';
import { FireblocksWebhookModule } from './modules/fireblocks_webhook/fireblocks_webhook.module';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { AuthModule } from '@archie/api/utils/auth0';
import { HealthModule } from '@archie/api/utils/health';
import { AssetInformationModule } from './modules/asset_information/asset_information.module';
import { ConfigVariables } from '@archie/api/collateral-api/constants';

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
        ConfigVariables.FIREBLOCKS_VAULT_ACCOUNT_ID,
        ConfigVariables.ASSET_LIST,
        ConfigVariables.FIREBLOCKS_API_KEY,
        ConfigVariables.FIREBLOCKS_PRIVATE_KEY,
        ConfigVariables.FIREBLOCKS_PUBLIC_KEY,
        ConfigVariables.INTERNAL_API_URL,
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
    HealthModule,
    DepositAddressModule,
    UserVaultAccountModule,
    OmnibusVaultAccountModule,
    FireblocksWebhookModule,
    AssetInformationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

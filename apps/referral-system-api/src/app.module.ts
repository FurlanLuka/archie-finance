import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '@archie/api/referral-system-api/constants';
import { HealthModule } from '@archie-microservices/health';
import { VaultModule } from '@archie-microservices/vault';
import { WaitlistModule } from '@archie/api/referral-system-api/waitlist';

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
        ConfigVariables.QUEUE_URL,
        ConfigVariables.PRIVATE_KEY,
        ConfigVariables.PUBLIC_KEY,
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
    HealthModule,
    WaitlistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

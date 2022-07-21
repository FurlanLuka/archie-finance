import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DepositAddressModule } from '../deposit_address/deposit_address.module';
import { FireblocksWebhookController } from './fireblocks_webhook.controller';
import { FireblocksWebhookService } from './fireblocks_webhook.service';
import { FireblocksWebhookStrategy } from './guard/fireblocks_webhook.strategy';
import { CryptoModule } from '@archie/api/utils/crypto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVaultAccount } from '../user_vault_account/user_vault_account.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import {
  COLLATERAL_DEPOSITED_EXCHANGE,
  COLLATERAL_WITHDRAW_COMPLETED_EXCHANGE,
} from '@archie/api/credit-api/constants';

@Module({
  imports: [
    PassportModule,
    DepositAddressModule,
    CryptoModule,
    TypeOrmModule.forFeature([UserVaultAccount]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          COLLATERAL_DEPOSITED_EXCHANGE,
          COLLATERAL_WITHDRAW_COMPLETED_EXCHANGE,
        ],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [FireblocksWebhookService, FireblocksWebhookStrategy],
  controllers: [FireblocksWebhookController],
})
export class FireblocksWebhookModule {}

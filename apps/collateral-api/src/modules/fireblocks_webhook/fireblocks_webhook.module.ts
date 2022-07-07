import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CollateralModule } from '../collateral/collateral.module';
import { DepositAddressModule } from '../deposit_address/deposit_address.module';
import { FireblocksWebhookController } from './fireblocks_webhook.controller';
import { FireblocksWebhookService } from './fireblocks_webhook.service';
import { FireblocksWebhookStrategy } from './guard/fireblocks_webhook.strategy';
import { CryptoModule } from '@archie-microservices/crypto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVaultAccount } from '../user_vault_account/user_vault_account.entity';

@Module({
  imports: [
    PassportModule,
    CollateralModule,
    DepositAddressModule,
    CryptoModule,
    TypeOrmModule.forFeature([UserVaultAccount]),
  ],
  providers: [FireblocksWebhookService, FireblocksWebhookStrategy],
  controllers: [FireblocksWebhookController],
})
export class FireblocksWebhookModule {}

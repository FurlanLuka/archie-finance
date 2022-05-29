import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CollateralModule } from '../collateral/collateral.module';
import { DepositAddressModule } from '../deposit_address/deposit_address.module';
import { FireblocksWebhookController } from './fireblocks_webhook.controller';
import { FireblocksWebhookService } from './fireblocks_webhook.service';
import { FireblocksWebhookStrategy } from './guard/fireblocks_webhook.strategy';

@Module({
  imports: [PassportModule, CollateralModule, DepositAddressModule],
  providers: [FireblocksWebhookService, FireblocksWebhookStrategy],
  controllers: [FireblocksWebhookController],
})
export class FireblocksWebhookModule {}

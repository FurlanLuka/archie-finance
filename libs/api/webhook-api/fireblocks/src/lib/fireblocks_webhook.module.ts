import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DepositAddressModule } from '@archie/api/collateral-api/deposit-address';
import { FireblocksWebhookController } from './fireblocks_webhook.controller';
import { FireblocksWebhookService } from './fireblocks_webhook.service';
import { FireblocksWebhookStrategy } from './guard/fireblocks_webhook.strategy';
import { CryptoModule } from '@archie/api/utils/crypto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVaultAccount } from '@archie/api/collateral-api/user-vault-account';

@Module({
  imports: [
    PassportModule,
    DepositAddressModule,
    CryptoModule.register({
      imports: [],
      inject: [],
      useFactory: () => ({}),
    }),
    TypeOrmModule.forFeature([UserVaultAccount]),
  ],
  providers: [FireblocksWebhookService, FireblocksWebhookStrategy],
  controllers: [FireblocksWebhookController],
})
export class FireblocksWebhookModule {}

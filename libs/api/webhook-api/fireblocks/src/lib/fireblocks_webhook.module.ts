import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FireblocksWebhookController } from './fireblocks_webhook.controller';
import { FireblocksWebhookService } from './fireblocks_webhook.service';
import { FireblocksWebhookStrategy } from './guard/fireblocks_webhook.strategy';
import { CryptoModule } from '@archie/api/utils/crypto';

@Module({
  imports: [
    PassportModule,
    CryptoModule.register({
      imports: [],
      inject: [],
      useFactory: () => ({}),
    }),
  ],
  providers: [FireblocksWebhookService, FireblocksWebhookStrategy],
  controllers: [FireblocksWebhookController],
})
export class FireblocksWebhookModule {}

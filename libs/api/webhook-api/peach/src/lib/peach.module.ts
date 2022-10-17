import { Module } from '@nestjs/common';
import { PeachWebhookService } from './peach.service';
import { PeachWebhookController } from './peach.controller';
import { PeachWebhookStrategy } from './guard/peach_webhook.strategy';

@Module({
  controllers: [PeachWebhookController],
  providers: [PeachWebhookService, PeachWebhookStrategy],
  exports: [PeachWebhookService],
})
export class PeachWebhookModule {}

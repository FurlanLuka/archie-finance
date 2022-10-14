import { Module } from '@nestjs/common';
import { PeachWebhookService } from './peach.service';
import { PeachApiModule } from './api/peach_api.module';
import { PeachApiService } from './api/peach_api.service';
import { PeachWebhookController } from './peach.controller';

@Module({
  controllers: [PeachWebhookController],
  providers: [PeachWebhookService, PeachApiModule, PeachApiService],
  exports: [PeachWebhookService],
})
export class PeachWebhookModule {}

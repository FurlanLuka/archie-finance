import { Module } from '@nestjs/common';
import { PeachApiService } from './peach_api.service';
import { PeachWebhookController } from '../peach.controller';

@Module({
  controllers: [PeachWebhookController],
  providers: [PeachApiService],
  exports: [PeachApiService],
})
export class PeachApiModule {}

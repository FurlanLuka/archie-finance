import { Module } from '@nestjs/common';
import { PeachWebhookService } from './peach.service';
import { PeachApiModule } from './api/peach_api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeachEvent } from './peach_webhook.entity';
import { PeachApiService } from './api/peach_api.service';
import { PeachWebhookController } from './peach.controller';

@Module({
  controllers: [PeachWebhookController],
  imports: [TypeOrmModule.forFeature([PeachEvent])],
  providers: [PeachWebhookService, PeachApiModule, PeachApiService],
  exports: [PeachWebhookService],
})
export class PeachWebhookModule {}

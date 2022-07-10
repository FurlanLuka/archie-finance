import { Module } from '@nestjs/common';
import { SendgirdQueueController } from './sendgrid.controller';
import { SendgridService } from './sendgrid.service';

@Module({
  controllers: [SendgirdQueueController],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {}

import { Module } from '@nestjs/common';
import { CreditQueueController } from './credit.controller';
import { CreditService } from './credit.service';

@Module({
  controllers: [CreditQueueController],
  providers: [CreditService],
  exports: [CreditService],
})
export class CreditModule {}

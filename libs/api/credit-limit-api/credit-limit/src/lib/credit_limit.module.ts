import { Module } from '@nestjs/common';
import { CreditLimitService } from './credit_limit.service';
import {
  CreditLimitController,
  CreditLimitQueueController,
} from './credit_limit.controller';

@Module({
  controllers: [CreditLimitController, CreditLimitQueueController],
  providers: [CreditLimitService],
  exports: [CreditLimitService],
})
export class CreditLimitModule {}

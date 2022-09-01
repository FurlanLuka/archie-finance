import { Module } from '@nestjs/common';
import { CreditLimitService } from './credit_limit.service';
import { CreditLimitQueueController } from './credit_limit.controller';

@Module({
  controllers: [CreditLimitQueueController],
  providers: [CreditLimitService],
  exports: [CreditLimitService],
})
export class CreditLimitModule {}

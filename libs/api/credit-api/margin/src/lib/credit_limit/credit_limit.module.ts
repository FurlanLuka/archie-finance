import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit, CreditModule } from '@archie/api/credit-api/credit';
import { CreditLimitService } from './credit_limit.service';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([Credit]), CreditModule],
  providers: [CreditLimitService],
  exports: [CreditLimitService],
})
export class CreditLimitModule {}

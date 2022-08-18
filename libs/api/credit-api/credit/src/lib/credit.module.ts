import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CreditController,
  CreditQueueController,
  InternalCreditController,
} from './credit.controller';
import { Credit } from './credit.entity';
import { CreditService } from './credit.service';

@Module({
  controllers: [
    CreditController,
    InternalCreditController,
    CreditQueueController,
  ],
  imports: [TypeOrmModule.forFeature([Credit])],
  providers: [CreditService],
  exports: [CreditService],
})
export class CreditModule {}

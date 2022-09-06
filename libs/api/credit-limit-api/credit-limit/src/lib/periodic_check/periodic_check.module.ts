import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditLimit } from '../credit_limit.entity';
import { PeriodicCheckService } from './periodic_check.service';
import {
  InternalPeriodicCheckController,
  PeriodicCheckQueueController,
} from './periodic_check.controller';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([CreditLimit])],
  controllers: [PeriodicCheckQueueController, InternalPeriodicCheckController],
  providers: [PeriodicCheckService],
  exports: [PeriodicCheckService],
})
export class PeriodicCheckModule {}

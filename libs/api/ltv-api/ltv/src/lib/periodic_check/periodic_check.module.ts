import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  InternalPeriodicCheckController,
  PeriodicCheckQueueController,
} from './periodic_check.controller';
import { PeriodicCheckService } from './periodic_check.service';
import { LtvCredit } from '../credit.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [PeriodicCheckQueueController, InternalPeriodicCheckController],
  imports: [UtilsModule, TypeOrmModule.forFeature([LtvCredit])],
  providers: [PeriodicCheckService],
  exports: [PeriodicCheckService],
})
export class PeriodicCheckModule {}

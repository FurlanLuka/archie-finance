import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerRecalculation } from './recalculation.entity';
import { SchedulerQueueController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerRecalculation])],
  controllers: [SchedulerQueueController],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerRecalculation } from './recalculation.entity';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerRecalculation])],
  providers: [],
  exports: [SchedulerService],
})
export class SchedulerModule {}

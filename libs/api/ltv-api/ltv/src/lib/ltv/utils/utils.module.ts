import { Module } from '@nestjs/common';
import { LtvUtilService } from './ltv.service';

@Module({
  providers: [LtvUtilService],
  exports: [LtvUtilService],
})
export class UtilsModule {}

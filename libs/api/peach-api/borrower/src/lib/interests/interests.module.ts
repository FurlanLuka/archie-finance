import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { PeachApiModule } from '../api/peach_api.module';
import { BorrowerUtil } from '../utils/utils.module';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';

@Module({
  controllers: [InterestsController],
  imports: [TypeOrmModule.forFeature([Borrower]), PeachApiModule, BorrowerUtil],
  providers: [InterestsService],
  exports: [InterestsService],
})
export class InterestsModule {}

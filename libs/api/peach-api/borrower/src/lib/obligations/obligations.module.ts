import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { PeachApiModule } from '../api/peach_api.module';
import { BorrowerUtil } from '../utils/utils.module';
import { ObligationsController } from './obligations.controller';
import { ObligationsService } from './obligations.service';
import { ObligationsUtilModule } from './utils/obligations_utils.module';

@Module({
  controllers: [ObligationsController],
  imports: [
    TypeOrmModule.forFeature([Borrower]),
    PeachApiModule,
    BorrowerUtil,
    ObligationsUtilModule,
  ],
  providers: [ObligationsService],
  exports: [ObligationsService],
})
export class ObligationsModule {}

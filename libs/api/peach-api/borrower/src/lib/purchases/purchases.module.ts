import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { PeachApiModule } from '../api/peach_api.module';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';

@Module({
  controllers: [PurchasesController],
  imports: [TypeOrmModule.forFeature([Borrower]), PeachApiModule],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}

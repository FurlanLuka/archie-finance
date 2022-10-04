import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from '../assets/assets.module';
import { CreditLimitAssetAllocationModule } from '../credit_limit_asset_allocation/credit_limit_asset_allocation.module';
import { LedgerModule } from '../ledger/ledger.module';
import {
  CreditLineController,
  CreditLineQueueController,
} from './credit_line.controller';
import { CreditLine } from './credit_line.entity';
import { CreditLineService } from './credit_line.service';

@Module({
  imports: [
    LedgerModule,
    AssetsModule,
    CreditLimitAssetAllocationModule,
    TypeOrmModule.forFeature([CreditLine]),
  ],
  controllers: [CreditLineQueueController, CreditLineController],
  providers: [CreditLineService],
})
export class CreditLineModule {}

import { Module } from '@nestjs/common';
import { AssetsModule } from '@archie/api/ledger-api/assets';
import { LedgerModule } from '../ledger/ledger.module';
import { LiquidationQueueController } from './liquidation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Liquidation } from './liquidation.entity';
import { LiquidationService } from './liquidation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Liquidation]),
    LedgerModule,
    AssetsModule,
  ],
  controllers: [LiquidationQueueController],
  providers: [LiquidationService],
})
export class LiquidationModule {}

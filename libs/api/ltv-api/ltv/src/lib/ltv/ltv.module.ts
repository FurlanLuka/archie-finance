import { Module } from '@nestjs/common';
import { LtvController, LtvQueueController } from './ltv.controller';
import { LtvService } from './ltv.service';
import { UtilsModule } from './utils/utils.module';
import { LedgerModule } from '../ledger/ledger.module';
import { CreditModule } from '../credit/credit.module';
import { MarginModule } from '../margin/margin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Liquidation } from '../margin/liquidation.entity';

@Module({
  // TODO: remove typeorm import
  imports: [
    UtilsModule,
    LedgerModule,
    CreditModule,
    MarginModule,
    TypeOrmModule.forFeature([Liquidation]),
  ],
  controllers: [LtvController, LtvQueueController],
  providers: [LtvService],
  exports: [LtvService],
})
export class LtvModule {}

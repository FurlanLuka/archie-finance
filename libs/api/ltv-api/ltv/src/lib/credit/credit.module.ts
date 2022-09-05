import { Module } from '@nestjs/common';
import { CreditQueueController } from './credit.controller';
import { CreditService } from './credit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LtvCollateral } from '../collateral.entity';
import { LtvCredit } from '../credit.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [CreditQueueController],
  imports: [TypeOrmModule.forFeature([LtvCollateral, LtvCredit]), UtilsModule],
  providers: [CreditService],
  exports: [CreditService],
})
export class CreditModule {}

import { Module } from '@nestjs/common';
import { CreditLimitService } from './credit_limit.service';
import { CreditLimitQueueController } from './credit_limit.controller';
import { UtilsModule } from './utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collateral } from './collateral.entity';
import { CreditLimit } from './credit_limit.entity';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([Collateral, CreditLimit])],
  controllers: [CreditLimitQueueController],
  providers: [CreditLimitService],
  exports: [CreditLimitService],
})
export class CreditLimitModule {}

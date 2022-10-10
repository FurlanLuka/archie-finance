import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from '@archie/api/fireblocks-api/assets';
import { LiquidationQueueController } from './liquidation.controller';
import { Liquidation } from './liquidation.entity';
import { LiquidationService } from './liquidation.service';
import { VaultAccountModule } from '../vault-account/vault_account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Liquidation]),
    AssetsModule,
    VaultAccountModule,
  ],
  providers: [LiquidationService],
  controllers: [LiquidationQueueController],
})
export class LiquidationModule {}

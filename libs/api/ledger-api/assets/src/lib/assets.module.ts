import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoingeckoApiModule } from './api/coingecko.module';
import { AssetsService } from './assets.service';
import { AssetPricesController } from './asset_prices.controller';
import { AssetPrices } from './asset_prices.entity';
import { AssetPricesService } from './asset_prices.service';

@Module({
  imports: [CoingeckoApiModule, TypeOrmModule.forFeature([AssetPrices])],
  providers: [AssetsService, AssetPricesService],
  controllers: [AssetPricesController],
  exports: [AssetsService, AssetPricesService],
})
export class AssetsModule {}

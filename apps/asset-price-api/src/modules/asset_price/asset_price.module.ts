import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetPriceController } from './asset_price.controller';
import { AssetPrice } from './asset_price.entity';
import { AssetPriceService } from './asset_price.service';
import { AssetPriceHistory } from './asset_price_history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetPrice, AssetPriceHistory])],
  controllers: [AssetPriceController],
  providers: [AssetPriceService],
})
export class AssetPriceModule {}
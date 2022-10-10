import { Controller, Get, Param, Post } from '@nestjs/common';
import { AssetPrice } from './asset_prices.interfaces';
import { AssetPricesService } from './asset_prices.service';

@Controller('/v1/asset/price')
export class AssetPricesController {
  constructor(private assetPricesService: AssetPricesService) {}

  @Get()
  async getLatestAssetPrices(): Promise<AssetPrice[]> {
    return this.assetPricesService.getLatestAssetPrices();
  }

  @Get(':assetId')
  async getLatestAssetPrice(
    @Param('assetId') assetId: string,
  ): Promise<AssetPrice> {
    return this.assetPricesService.getLatestAssetPrice(assetId);
  }
}

@Controller('internal/asset/price')
export class InternalAssetPricesController {
  constructor(private assetPricesService: AssetPricesService) {}

  @Post('fetch')
  async fetchAssetPrices(): Promise<void> {
    return this.assetPricesService.fetchAssetPrices();
  }
}

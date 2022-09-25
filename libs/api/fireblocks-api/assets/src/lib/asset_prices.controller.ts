import { Controller, Get, Post } from '@nestjs/common';
import { GetAssetPriceResponse } from '@archie/api/fireblocks-api/data-transfer-objects';
import { AssetPricesService } from './asset_prices.service';

@Controller('/v1/asset/price')
export class AssetPricesController {
  constructor(private assetPricesService: AssetPricesService) {}

  @Get()
  async getLatestAssetPrices(): Promise<GetAssetPriceResponse[]> {
    return this.assetPricesService.getLatestAssetPrices();
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

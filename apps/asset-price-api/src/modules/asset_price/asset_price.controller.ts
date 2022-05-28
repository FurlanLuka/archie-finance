import { Controller, Get, Param } from '@nestjs/common';
import {
  GetAssetPriceResponse,
  GetAssetPricesResponse,
} from './asset_price.interfaces';
import { AssetPriceService } from './asset_price.service';

@Controller('v1/asset_price')
export class AssetPriceController {
  constructor(private assetPriceService: AssetPriceService) {}

  @Get()
  async getAssetPrices(): Promise<GetAssetPricesResponse> {
    return this.assetPriceService.getAssetPrices();
  }

  @Get(':asset')
  async getAssetPrice(
    @Param('asset') asset: string,
  ): Promise<GetAssetPriceResponse> {
    return this.assetPriceService.getAssetPrice(asset);
  }
}

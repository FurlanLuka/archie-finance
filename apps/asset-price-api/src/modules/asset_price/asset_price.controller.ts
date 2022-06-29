import { Controller, Get, Param } from '@nestjs/common';
import { GetAssetPriceResponseDto } from './asset_price.dto';
import { AssetPriceService } from './asset_price.service';

@Controller(['v1/asset_price'])
export class AssetPriceController {
  constructor(private assetPriceService: AssetPriceService) {}

  @Get()
  async getAssetPrices(): Promise<GetAssetPriceResponseDto[]> {
    return this.assetPriceService.getAssetPrices();
  }

  @Get(':asset')
  async getAssetPrice(
    @Param('asset') asset: string,
  ): Promise<GetAssetPriceResponseDto> {
    return this.assetPriceService.getAssetPrice(asset);
  }
}

@Controller('internal/asset_price')
export class InternalAssetPriceController {
  constructor(private assetPriceService: AssetPriceService) {}

  @Get()
  async getAssetPrices(): Promise<GetAssetPriceResponseDto[]> {
    return this.assetPriceService.getAssetPrices();
  }

  @Get('fetch')
  async fetchAssetPrices(): Promise<void> {
    return this.assetPriceService.getCoinPrices();
  }

  @Get(':asset')
  async getAssetPrice(
    @Param('asset') asset: string,
  ): Promise<GetAssetPriceResponseDto> {
    return this.assetPriceService.getAssetPrice(asset);
  }
}

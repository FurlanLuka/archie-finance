import { Controller, Get, Post } from '@nestjs/common';
import { GetAssetPriceResponse } from '@archie/api/collateralization-api/data-transfer-objects';
import { AssetsService } from './assets.service';

@Controller('/v1/assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @Get('price')
  async getLatestAssetPrices(): Promise<GetAssetPriceResponse[]> {
    return this.assetsService.getLatestAssetPrices();
  }
}

@Controller('internal/assets')
export class InternalAssetsController {
  constructor(private assetsService: AssetsService) {}

  @Post('price/fetch')
  async fetchAssetPrices(): Promise<void> {
    return this.assetsService.fetchAssetPrices();
  }
}

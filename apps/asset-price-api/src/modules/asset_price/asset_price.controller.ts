import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { GetAssetPriceResponseDto } from './asset_price.dto';
import { AssetPriceService } from './asset_price.service';
import { ApiErrorResponse } from '@archie-microservices/openapi';

@Controller(['v1/asset_price'])
export class AssetPriceController {
  constructor(private assetPriceService: AssetPriceService) {}

  @Get()
  @ApiErrorResponse([NotFoundException])
  async getAssetPrices(): Promise<GetAssetPriceResponseDto[]> {
    return this.assetPriceService.getAssetPrices();
  }

  @Get(':asset')
  @ApiErrorResponse([NotFoundException])
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
  @ApiErrorResponse([NotFoundException])
  async getAssetPrice(
    @Param('asset') asset: string,
  ): Promise<GetAssetPriceResponseDto> {
    return this.assetPriceService.getAssetPrice(asset);
  }
}

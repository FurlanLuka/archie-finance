import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { GetAssetPriceResponse } from './asset_price.interfaces';
import { AssetPriceService } from './asset_price.service';
import { ApiErrorResponse } from '@archie/api/utils/openapi';
import {
  RequestHandler,
  RPCResponse,
  RPCResponseType,
} from '@archie/api/utils/queue';
import {
  GET_ASSET_PRICES_RPC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/asset-price-api/constants';

@Controller(['v1/asset_price'])
export class AssetPriceController {
  constructor(private assetPriceService: AssetPriceService) {}

  @Get()
  @ApiErrorResponse([NotFoundException])
  async getAssetPrices(): Promise<GetAssetPriceResponse[]> {
    return this.assetPriceService.getAssetPrices();
  }

  @Get(':asset')
  @ApiErrorResponse([NotFoundException])
  async getAssetPrice(
    @Param('asset') asset: string,
  ): Promise<GetAssetPriceResponse> {
    return this.assetPriceService.getAssetPrice(asset);
  }
}

@Controller('internal/asset_price')
export class InternalAssetPriceController {
  constructor(private assetPriceService: AssetPriceService) {}

  @Get('fetch')
  async fetchAssetPrices(): Promise<void> {
    return this.assetPriceService.getCoinPrices();
  }
}

@Controller()
export class AssetPriceQueueController {
  constructor(private assetPriceService: AssetPriceService) {}

  @RequestHandler(GET_ASSET_PRICES_RPC, SERVICE_QUEUE_NAME)
  async getAssetPrices(): Promise<RPCResponse<GetAssetPriceResponse[]>> {
    try {
      const data = await this.assetPriceService.getAssetPrices();

      return {
        type: RPCResponseType.SUCCESS,
        data,
      };
    } catch (error) {
      return {
        type: RPCResponseType.ERROR,
        message: error.message ?? 'INTERNAL_SERVER_EXCEPTION',
      };
    }
  }
}

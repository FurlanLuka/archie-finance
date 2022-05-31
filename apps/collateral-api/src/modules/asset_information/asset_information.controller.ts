import { Controller, Get, Param } from '@nestjs/common';
import {
  GetAssetListResponse,
  GetAssetInformationResponse,
} from '@archie-microservices/api-interfaces/asset_information';
import { AssetInformationService } from './asset_information.service';

@Controller('internal/asset_information')
export class InternalAssetInformationController {
  constructor(private assetInformationService: AssetInformationService) {}

  @Get()
  getAssetList(): GetAssetListResponse {
    return this.assetInformationService.getAssetList();
  }

  @Get(':asset')
  getAssetInformation(
    @Param('asset') asset: string,
  ): GetAssetInformationResponse {
    return this.assetInformationService.getAssetInformation(asset);
  }
}

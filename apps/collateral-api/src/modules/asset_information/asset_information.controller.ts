import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import {
  GetAssetListResponseDto,
  GetAssetInformationResponseDto,
} from './asset_information.dto';
import { AssetInformationService } from './asset_information.service';
import { ApiErrorResponse } from '@archie-microservices/openapi';

@Controller('internal/asset_information')
export class InternalAssetInformationController {
  constructor(private assetInformationService: AssetInformationService) {}

  @Get()
  getAssetList(): GetAssetListResponseDto {
    return this.assetInformationService.getAssetList();
  }

  @Get(':asset')
  @ApiErrorResponse([NotFoundException])
  getAssetInformation(
    @Param('asset') asset: string,
  ): GetAssetInformationResponseDto {
    return this.assetInformationService.getAssetInformation(asset);
  }
}

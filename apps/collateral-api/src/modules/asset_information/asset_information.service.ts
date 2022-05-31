import { ConfigService } from '@archie-microservices/config';
import {
  GetAssetInformationResponse,
  GetAssetListResponse,
  AssetList,
} from '@archie-microservices/api-interfaces/asset_information';
import { ConfigVariables } from '../../interfaces';
import { NotFoundException } from '@nestjs/common';

export class AssetInformationService {
  constructor(private configService: ConfigService) {}

  public getAssetList(): GetAssetListResponse {
    return this.configService.get(ConfigVariables.ASSET_LIST);
  }

  public getAssetInformation(asset: string): GetAssetInformationResponse {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    if (assetList[asset] === undefined) {
      throw new NotFoundException();
    }

    return assetList[asset];
  }
}

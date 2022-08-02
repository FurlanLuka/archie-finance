import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetInformation, AssetList } from './asset-information.interfaces';

@Injectable()
export class AssetInformationService {
  constructor(private configService: ConfigService) {}

  public getAssetList(): AssetList {
    return this.configService.get(ConfigVariables.ASSET_LIST);
  }

  public getAssetInformation(asset: string): AssetInformation {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    if (assetList[asset] === undefined) {
      throw new NotFoundException();
    }

    return assetList[asset];
  }
}

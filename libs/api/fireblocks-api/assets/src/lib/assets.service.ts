import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { Injectable } from '@nestjs/common';
import { AssetInformation, AssetList } from './assets.interfaces';

@Injectable()
export class AssetsService {
  constructor(private configService: ConfigService) {}

  public getSupportedAssetList(): AssetList {
    return this.configService.get(ConfigVariables.ASSET_LIST);
  }

  public getAssetInformation(asset: string): AssetInformation | undefined {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    return {
      ...assetList[asset],
      id: asset,
    };
  }

  public getAssetInformationForFireblocksId(
    fireblocksAssetId: string,
  ): AssetInformation | undefined {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    const asset: string | undefined = Object.keys(assetList).find((key) => {
      return assetList[key].fireblocksId !== fireblocksAssetId;
    });

    if (asset === undefined) {
      return undefined;
    }

    return {
      ...assetList[asset],
      id: asset,
    };
  }
}

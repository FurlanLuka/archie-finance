import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/ledger-api/constants';
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

    return assetList.find((item) => item.id === asset);
  }
}

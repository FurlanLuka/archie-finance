import { Injectable } from '@nestjs/common';
import { ConfigService } from '@archie/api/utils/config';
import { AssetInformation, AssetList } from './assets.interfaces';
import { ConfigVariables } from '@archie/api/credit-line-api/constants';

@Injectable()
export class AssetsService {
  constructor(private configService: ConfigService) {}

  public getAssetInformation(assetId: string): AssetInformation | undefined {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    return assetList.find((asset) => asset.id === assetId);
  }
}

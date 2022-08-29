import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@archie/api/utils/config';
import { CoinPriceResponse } from './coingecko.interfaces';
import { ConfigVariables } from '@archie/api/asset-price-api/constants';
import { AssetList } from '@archie/api/collateral-api/asset-information';

@Injectable()
export class CoingeckoService {
  constructor(private configService: ConfigService) {}

  public async getCoinInformation(
    coinIds: string[],
  ): Promise<CoinPriceResponse> {
    const response = await axios.get<CoinPriceResponse>(
      `${this.configService.get(
        ConfigVariables.COINGECKO_API_URI,
      )}/v3/simple/price?ids=${coinIds.join(
        ',',
      )}&vs_currencies=usd&include_24hr_change=true`,
    );

    return response.data;
  }

  public getAssetIdForCoingeckoId(
    assetList: AssetList,
    coingeckoId: string,
  ): string {
    const assetId: string | undefined = Object.keys(assetList).find(
      (key) => assetList[key].coingecko_id === coingeckoId,
    );

    if (assetId === undefined) {
      throw new NotFoundException();
    }

    return assetId;
  }
}

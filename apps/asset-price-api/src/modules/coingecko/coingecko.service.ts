import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@archie-microservices/config';
import { CoinPriceResponse } from './coingecko.interfaces';
import { AssetList, ConfigVariables } from '../../interfaces';

@Injectable()
export class CoingeckoService {
  constructor(private configService: ConfigService) {}

  public async getCoinInformation(
    coinIds: string[],
  ): Promise<CoinPriceResponse> {
    const response = await axios.get(
      `${this.configService.get(
        ConfigVariables.COINGECKO_API_URI,
      )}/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`,
    );

    return response.data;
  }

  public getAssetIdForCoingeckoId(
    assetList: AssetList,
    coingeckoId: string,
  ): string {
    Logger.log(coingeckoId);
    const assetId: string | undefined = Object.keys(assetList).find(
      (key) => assetList[key].coingecko_id === coingeckoId,
    );

    if (assetId === undefined) {
      throw new NotFoundException();
    }

    return assetId;
  }
}

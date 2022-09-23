import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from '@archie/api/collateralization-api/constants';
import { CoingeckoAssetInformationResponse } from './coingecko.interfaces';

@Injectable()
export class CoingeckoApiService {
  constructor(private configService: ConfigService) {}

  public async getCoingeckoAssetInformation(
    coingeckoAssetIds: string[],
  ): Promise<CoingeckoAssetInformationResponse> {
    const response = await axios.get<CoingeckoAssetInformationResponse>(
      `${this.configService.get(
        ConfigVariables.COINGECKO_API_URI,
      )}/v3/simple/price?ids=${coingeckoAssetIds.join(
        ',',
      )}&vs_currencies=usd&include_24hr_change=true`,
    );

    return response.data;
  }
}

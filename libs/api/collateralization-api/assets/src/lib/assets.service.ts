import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AssetList,
  AssetInformation,
  GetAssetPriceResponse,
} from '@archie/api/collateralization-api/data-transfer-objects';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetPrice } from './asset_price.entity';
import { Repository } from 'typeorm';
import { CoingeckoAssetInformationResponse } from './api/coingecko.interfaces';
import { CoingeckoApiService } from './api/coingecko.service';

@Injectable()
export class AssetsService {
  constructor(
    private configService: ConfigService,
    private coingeckoApiService: CoingeckoApiService,
    @InjectRepository(AssetPrice)
    private assetPriceRepository: Repository<AssetPrice>,
  ) {}

  public getSupportedAssetList(): AssetList {
    return this.configService.get(ConfigVariables.ASSET_LIST);
  }

  public getAssetInformation(asset: string): AssetInformation {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );
    const assetInformation = assetList[asset];

    if (assetInformation === undefined) {
      throw new NotFoundException();
    }

    return assetInformation;
  }

  public async fetchAssetPrices(): Promise<void> {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    const assets: string[] = Object.keys(assetList);

    const coingeckoAssetIds: string[] = assets.map(
      (asset) => assetList[asset].coingeckoId,
    );

    const coingeckoAssetInformation: CoingeckoAssetInformationResponse =
      await this.coingeckoApiService.getCoingeckoAssetInformation(
        coingeckoAssetIds,
      );

    const assetPrices: Partial<AssetPrice>[] = [];

    Object.keys(coingeckoAssetInformation).forEach((coingeckoAssetKey) => {
      const coingeckoAsset = coingeckoAssetInformation[coingeckoAssetKey];

      const assetId: string | undefined = assets.find((assetKey) => {
        const archieAsset = assetList[assetKey];

        return coingeckoAssetKey === archieAsset.coingeckoId;
      });

      if (assetId === undefined) {
        return;
      }

      assetPrices.push({
        asset: assetId,
        price: coingeckoAsset.usd,
        currency: 'USD',
        dailyChange: coingeckoAsset.usd_24h_change,
      });
    });

    await this.assetPriceRepository.save(assetPrices);
  }

  public async getLatestAssetPrices(): Promise<GetAssetPriceResponse[]> {
    const assetPrices: AssetPrice[] = await this.assetPriceRepository.find();

    return assetPrices.map(
      ({ createdAt: _createdAt, updatedAt: _updatedAt, ...assetPriceRecord }) =>
        assetPriceRecord,
    );
  }
}

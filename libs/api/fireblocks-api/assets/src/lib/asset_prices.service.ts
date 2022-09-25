import { Injectable } from '@nestjs/common';
import {
  AssetList,
  GetAssetPriceResponse,
} from '@archie/api/fireblocks-api/data-transfer-objects';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetPrices } from './asset_prices.entity';
import { Repository } from 'typeorm';
import { CoingeckoAssetInformationResponse } from './api/coingecko.interfaces';
import { CoingeckoApiService } from './api/coingecko.service';
import { AssetsService } from './assets.service';

@Injectable()
export class AssetPricesService {
  constructor(
    private coingeckoApiService: CoingeckoApiService,
    private assetsService: AssetsService,
    @InjectRepository(AssetPrices)
    private assetPriceRepository: Repository<AssetPrices>,
  ) {}

  public async fetchAssetPrices(): Promise<void> {
    const assetList: AssetList = this.assetsService.getSupportedAssetList();

    const assets: string[] = Object.keys(assetList);

    const coingeckoAssetIds: string[] = assets.map(
      (asset) => assetList[asset].coingeckoId,
    );

    const coingeckoAssetInformation: CoingeckoAssetInformationResponse =
      await this.coingeckoApiService.getCoingeckoAssetInformation(
        coingeckoAssetIds,
      );

    const assetPrices: Partial<AssetPrices>[] = [];

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
    const assetPrices: AssetPrices[] = await this.assetPriceRepository.find();

    return assetPrices.map(
      ({ createdAt: _createdAt, updatedAt: _updatedAt, ...assetPriceRecord }) =>
        assetPriceRecord,
    );
  }
}

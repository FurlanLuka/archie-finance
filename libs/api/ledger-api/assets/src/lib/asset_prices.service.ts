import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetPrices } from './asset_prices.entity';
import { Repository } from 'typeorm';
import { CoingeckoAssetInformationResponse } from './api/coingecko.interfaces';
import { CoingeckoApiService } from './api/coingecko.service';
import { AssetsService } from './assets.service';
import { AssetInformation, AssetList } from './assets.interfaces';
import { AssetNotFoundError } from './asset_prices.errors';
import { AssetPriceDto } from '@archie/api/ledger-api/data-transfer-objects';

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

    const coingeckoAssetIds: string[] = assetList.map(
      (asset) => asset.coingeckoId,
    );

    const coingeckoAssetInformation: CoingeckoAssetInformationResponse =
      await this.coingeckoApiService.getCoingeckoAssetInformation(
        coingeckoAssetIds,
      );

    const assetPrices: Partial<AssetPrices>[] = [];

    Object.keys(coingeckoAssetInformation).forEach((coingeckoAssetKey) => {
      const coingeckoAsset = coingeckoAssetInformation[coingeckoAssetKey];

      const asset: AssetInformation | undefined = assetList.find((item) => {
        return coingeckoAssetKey === item.coingeckoId;
      });

      if (asset === undefined) {
        return;
      }

      assetPrices.push({
        assetId: asset.id,
        price: coingeckoAsset.usd,
        currency: 'USD',
        dailyChange: coingeckoAsset.usd_24h_change,
      });
    });

    await this.assetPriceRepository.save(assetPrices);
  }

  public async getLatestAssetPrices(): Promise<AssetPriceDto[]> {
    const assetPrices: AssetPrices[] = await this.assetPriceRepository.find();

    return assetPrices.map(
      ({ createdAt: _createdAt, updatedAt: _updatedAt, ...assetPriceRecord }) =>
        assetPriceRecord,
    );
  }

  public async getLatestAssetPrice(assetId: string): Promise<AssetPriceDto> {
    const assetPrice: AssetPrices | null =
      await this.assetPriceRepository.findOneBy({
        assetId,
      });

    if (assetPrice === null) {
      throw new AssetNotFoundError({
        assetId,
      });
    }

    return {
      assetId,
      currency: assetPrice.currency,
      dailyChange: assetPrice.dailyChange,
      price: assetPrice.price,
    };
  }
}

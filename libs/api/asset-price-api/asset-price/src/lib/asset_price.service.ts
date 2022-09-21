import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetPrice } from './asset_price.entity';
import { Repository } from 'typeorm';
import { AssetPriceHistory } from './asset_price_history.entity';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';
import { CoingeckoService } from '@archie/api/asset-price-api/coingecko';
import { CoinPriceResponse } from '@archie/api/asset-price-api/coingecko';
import { AssetList } from '@archie/api/collateral-api/asset-information';
import { QueueService } from '@archie/api/utils/queue';
import { GET_ASSET_INFORMATION_RPC } from '@archie/api/collateral-api/constants';

@Injectable()
export class AssetPriceService {
  constructor(
    private coingeckoService: CoingeckoService,
    @InjectRepository(AssetPrice)
    private assetPriceRepository: Repository<AssetPrice>,
    @InjectRepository(AssetPriceHistory)
    private assetPriceHistoryRepository: Repository<AssetPriceHistory>,
    private queueService: QueueService,
  ) {}

  public async getAssetPrices(): Promise<GetAssetPriceResponse[]> {
    return this.assetPriceRepository.find();
  }

  public async getAssetPrice(asset: string): Promise<GetAssetPriceResponse> {
    const assetPrice: AssetPrice | null =
      await this.assetPriceRepository.findOneBy({
        asset,
      });

    if (assetPrice === null) {
      throw new NotFoundException();
    }

    return assetPrice;
  }

  public async getCoinPrices(): Promise<void> {
    const assetList: AssetList = await this.queueService.request(
      GET_ASSET_INFORMATION_RPC,
    );

    const assets: string[] = Object.keys(assetList).map(
      (asset: string) => assetList[asset]!.coingecko_id,
    );

    const prices: CoinPriceResponse =
      await this.coingeckoService.getCoinInformation(assets);

    const assetPriceEntities: Partial<AssetPrice>[] = [];
    const assetPriceHistoryEntities: Partial<AssetPriceHistory>[] = [];

    Object.keys(prices).forEach((key: string) => {
      try {
        const assetPrice: number = prices[key].usd;
        const dailyChange: number = prices[key].usd_24h_change;
        const assetId: string = this.coingeckoService.getAssetIdForCoingeckoId(
          assetList,
          key,
        );

        assetPriceEntities.push({
          asset: assetId,
          price: assetPrice,
          dailyChange,
          currency: 'USD',
        });

        assetPriceHistoryEntities.push({
          asset: assetId,
          price: assetPrice,
          dailyChange,
          currency: 'USD',
        });
      } catch (error) {
        Logger.log({
          code: 'ERROR_FETCHING_COIN_PRICE',
          metadata: {
            error: JSON.stringify(error),
          },
        });
      }
    });

    await this.assetPriceRepository.save(assetPriceEntities);
    await this.assetPriceHistoryRepository.insert(assetPriceHistoryEntities);
  }
}

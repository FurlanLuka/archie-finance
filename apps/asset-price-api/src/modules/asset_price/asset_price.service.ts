import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetPrice } from './asset_price.entity';
import { Repository } from 'typeorm';
import { AssetPriceHistory } from './asset_price_history.entity';
import { ConfigService } from '@archie-microservices/config';
import { AssetList, ConfigVariables } from '../../interfaces';
import {
  GetAssetPriceResponse,
  GetAssetPricesResponse,
} from '@archie-microservices/api-interfaces/asset_price';
import { CoingeckoService } from '../coingecko/coingecko.service';
import { CoinPriceResponse } from '../coingecko/coingecko.interfaces';

@Injectable()
export class AssetPriceService {
  constructor(
    private coingeckoService: CoingeckoService,
    private configService: ConfigService,
    @InjectRepository(AssetPrice)
    private assetPriceRepository: Repository<AssetPrice>,
    @InjectRepository(AssetPriceHistory)
    private assetPriceHistoryRepository: Repository<AssetPriceHistory>,
  ) {}

  public async getAssetPrices(): Promise<GetAssetPricesResponse> {
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
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    Logger.log({
      log: 'ASSET_LIST',
      list: JSON.stringify(assetList),
    });

    const assets: string[] = Object.keys(assetList).map(
      (asset: string) => assetList[asset].coingecko_id,
    );

    const prices: CoinPriceResponse =
      await this.coingeckoService.getCoinInformation(assets);

    const assetPriceEntities = [];
    const assetPriceHistoryEntities = [];

    Object.keys(prices).forEach((key: string) => {
      try {
        const assetPrice: number = prices[key].usd;
        const assetId: string = this.coingeckoService.getAssetIdForCoingeckoId(
          assetList,
          key,
        );

        assetPriceEntities.push({
          asset: assetId,
          price: assetPrice,
          currency: 'USD',
        });

        assetPriceHistoryEntities.push({
          asset: assetId,
          price: assetPrice,
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

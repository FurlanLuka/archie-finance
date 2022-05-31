import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WebSocket } from 'ws';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetPrice } from './asset_price.entity';
import { Repository } from 'typeorm';
import { AssetPriceHistory } from './asset_price_history.entity';
import { CoinApiMessage, CoinApiMessageType } from './asset_price.interfaces';
import { ConfigService } from '@archie-microservices/config';
import { AssetList, ConfigVariables } from '../../interfaces';
import {
  GetAssetPriceResponse,
  GetAssetPricesResponse,
} from '@archie-microservices/api-interfaces/asset_price';

@Injectable()
export class AssetPriceService {
  private websocket: WebSocket;

  constructor(
    private configService: ConfigService,
    @InjectRepository(AssetPrice)
    private assetPriceRepository: Repository<AssetPrice>,
    @InjectRepository(AssetPriceHistory)
    private assetPriceHistoryRepository: Repository<AssetPriceHistory>,
  ) {
    this.connect();
  }

  private connect(): void {
    Logger.log('Starting websocket connection');

    this.websocket = new WebSocket(
      this.configService.get(ConfigVariables.COINAPI_WEBSOCKET_URI),
    );

    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    const assetPairs: string[] = Object.keys(assetList).map(
      (asset: string) => `${assetList[asset].coinapi_id}/USD`,
    );

    this.websocket.on('error', (error) => {
      Logger.error({
        code: 'COINAPI_WEBSOCKET_ERROR',
        metadata: {
          error: JSON.stringify(error),
        },
      });

      this.websocket.close();
    });

    this.websocket.on('close', () => {
      Logger.warn('Connection closed....attempting to reconnect');
      this.connect();
    });

    this.websocket.on('unexpected-response', () => {
      Logger.error({
        code: 'COINAPI_WEBSOCKET_UNEXPECTED_RESPONSE',
      });
    });

    this.websocket.on('open', () => {
      Logger.log('Connection started');

      this.websocket.send(
        JSON.stringify({
          type: 'hello',
          apikey: this.configService.get(ConfigVariables.COINAPI_KEY),
          heartbeat: false,
          subscribe_data_type: [CoinApiMessageType.EXRATE],
          subscribe_filter_asset_id: assetPairs,
          subscribe_update_limit_ms_exrate: 60000,
        }),
      );
    });

    this.websocket.on('message', async (data) => {
      const message: CoinApiMessage = JSON.parse(data.toString());

      Logger.log('Received message');
      Logger.log(JSON.stringify(message));

      if (message.type === CoinApiMessageType.EXRATE) {
        await this.assetPriceRepository.save({
          asset: message.asset_id_base,
          price: message.rate,
          currency: message.asset_id_quote,
        });

        await this.assetPriceHistoryRepository.insert({
          asset: message.asset_id_base,
          price: message.rate,
          currency: message.asset_id_quote,
        });
      }
    });
  }

  public async getAssetPrices(): Promise<GetAssetPricesResponse> {
    return this.assetPriceRepository.find();
  }

  public async getAssetPrice(asset: string): Promise<GetAssetPriceResponse> {
    const assetPrice: AssetPrice | undefined =
      await this.assetPriceRepository.findOne({
        asset,
      });

    if (assetPrice === undefined) {
      throw new NotFoundException();
    }

    return assetPrice;
  }
}

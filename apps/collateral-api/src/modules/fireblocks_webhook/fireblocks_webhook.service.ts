import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CollateralService } from '../collateral/collateral.service';
import { DepositAddressService } from '../deposit_address/deposit_address.service';
import { FireblocksWebhookDto } from '../fireblocks_webhook/fireblocks_webhook.dto';
import {
  EventType,
  FireblocksWebhookPayload,
} from './fireblocks_webhook.interfaces';
import { ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '../../interfaces';
import { AssetList } from '@archie-microservices/api-interfaces/asset_information';

@Injectable()
export class FireblocksWebhookService {
  constructor(
    private collateralService: CollateralService,
    private depositAddressService: DepositAddressService,
    private configService: ConfigService,
  ) {}

  public async webhookHandler(payload: FireblocksWebhookDto): Promise<void> {
    Logger.log({
      code: 'FIREBLOCKS_WEBHOOK',
      ...payload,
    });

    if (
      payload.type === EventType.TRANSACTION_CREATED ||
      payload.type === EventType.TRANSACTION_STATUS_UPDATED ||
      payload.type === EventType.TRANSACTION_APPROVAL_STATUS_UPDATED
    ) {
      this.handleTransactionWebhook(payload as FireblocksWebhookPayload);
    }
  }

  private async handleTransactionWebhook(
    payload: FireblocksWebhookPayload,
  ): Promise<void> {
    try {
      const userId: string =
        await this.depositAddressService.getUserIdForDepositAddress(
          payload.data.destinationAddress,
        );

      Logger.log({
        code: 'FIREBLOCKS_PAYLOAD',
        ...payload,
      });

      const assetList: AssetList = this.configService.get(
        ConfigVariables.ASSET_LIST,
      );

      Logger.log({
        code: 'ASSET_LIST',
        ...assetList,
      });

      const asset: string[] = Object.keys(assetList).flatMap((key) => {
        if (assetList[key].fireblocks_id !== payload.data.assetId) {
          return [];
        }

        return [key];
      });

      Logger.log({
        code: 'ASSET_INFORMATION',
        ...asset,
      });

      const assetId: string =
        asset.length > 0 ? asset[0] : payload.data.assetId;

      await this.collateralService.createDeposit(
        payload.data.id,
        userId,
        assetId,
        payload.data.netAmount,
        payload.data.destinationAddress,
        payload.data.status,
      );
    } catch (error) {
      Logger.error({
        code: 'FIREBLOCKS_WEBHOOK_ERROR',
        metadata: {
          transactionId: payload.data.id,
          assetId: payload.data.assetId,
          amount: payload.data.netAmount,
          destination: payload.data.destinationAddress,
          status: payload.data.status,
        },
      });

      throw new InternalServerErrorException();
    }
  }
}

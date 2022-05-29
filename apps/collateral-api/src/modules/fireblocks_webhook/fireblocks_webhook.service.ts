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

@Injectable()
export class FireblocksWebhookService {
  constructor(
    private collateralService: CollateralService,
    private depositAddressService: DepositAddressService,
  ) {}

  public async webhookHandler(payload: FireblocksWebhookDto): Promise<void> {
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

      await this.collateralService.createDeposit(
        payload.data.id,
        userId,
        payload.data.assetId,
        payload.data.netAmount,
        payload.data.destinationAddress,
        payload.data.status,
      );
    } catch (error) {
      Logger.log({
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

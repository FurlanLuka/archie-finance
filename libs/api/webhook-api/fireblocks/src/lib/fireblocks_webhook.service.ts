import { Injectable, Logger } from '@nestjs/common';
import { PeerType } from 'fireblocks-sdk';
import { FireblocksWebhookDto } from './fireblocks_webhook.dto';
import {
  EventType,
  FireblocksWebhookPayload,
} from './fireblocks_webhook.interfaces';
import {
  FireblocksDepositTransactionPayload,
  FireblocksInternalTransactionPayload,
  FireblocksWithdrawTransactionPayload,
} from '@archie/api/webhook-api/data-transfer-objects';
import { QueueService } from '@archie/api/utils/queue';
import {
  WEBHOOK_FIREBLOCKS_DEPOSIT_TRANSACTION_TOPIC,
  WEBHOOK_FIREBLOCKS_INTERNAL_TRANSACTION_TOPIC,
  WEBHOOK_FIREBLOCKS_WITHDRAWAL_TRANSACTION_TOPIC,
} from '@archie/api/webhook-api/constants';

@Injectable()
export class FireblocksWebhookService {
  constructor(private queueService: QueueService) {}

  public async webhookHandler(payload: FireblocksWebhookDto): Promise<void> {
    if (
      payload.type === EventType.TRANSACTION_CREATED ||
      payload.type === EventType.TRANSACTION_STATUS_UPDATED ||
      payload.type === EventType.TRANSACTION_APPROVAL_STATUS_UPDATED
    ) {
      await this.handleTransactionWebhook(payload as FireblocksWebhookPayload);
    }
  }

  private async handleTransactionWebhook(
    payload: FireblocksWebhookPayload,
  ): Promise<void> {
    Logger.log(payload.data);
    if (
      payload.data.source.type === PeerType.VAULT_ACCOUNT &&
      payload.data.destination.type === PeerType.VAULT_ACCOUNT &&
      payload.data.netAmount &&
      payload.data.networkFee
    ) {
      this.queueService.publish<FireblocksInternalTransactionPayload>(
        WEBHOOK_FIREBLOCKS_INTERNAL_TRANSACTION_TOPIC,
        {
          transactionId: payload.data.id,
          assetId: payload.data.assetId,
          sourceVaultId: payload.data.source.id,
          destinationVaultId: payload.data.destination.id,
          amount: payload.data.amount,
          netAmount: payload.data.netAmount,
          networkFee: payload.data.networkFee,
          status: payload.data.status,
        },
      );
    } else if (
      payload.data.source.type === PeerType.VAULT_ACCOUNT &&
      payload.data.destination.type === PeerType.EXTERNAL_WALLET &&
      payload.data.destinationAddress.length > 0
    ) {
      this.queueService.publish<FireblocksWithdrawTransactionPayload>(
        WEBHOOK_FIREBLOCKS_WITHDRAWAL_TRANSACTION_TOPIC,
        {
          transactionId: payload.data.id,
          internalTransactionId: payload.data.externalTxId,
          assetId: payload.data.assetId,
          sourceVaultId: payload.data.source.id,
          destinationAddress: payload.data.destinationAddress,
          amount: payload.data.amount,
          netAmount: payload.data.netAmount,
          networkFee: payload.data.networkFee,
          status: payload.data.status,
        },
      );
    } else if (
      (payload.data.source.type === PeerType.EXTERNAL_WALLET ||
        payload.data.source.type === PeerType.UNKNOWN) &&
      payload.data.destination.type === PeerType.VAULT_ACCOUNT
    ) {
      if (payload.data.sourceAddress === undefined) {
        Logger.error({
          code: 'SOURCE_ADDRESS_NOT_PRESENT',
          transactionId: payload.data.id,
        });
        return;
      }

      this.queueService.publish<FireblocksDepositTransactionPayload>(
        WEBHOOK_FIREBLOCKS_DEPOSIT_TRANSACTION_TOPIC,
        {
          transactionId: payload.data.id,
          assetId: payload.data.assetId,
          sourceAddress: payload.data.sourceAddress,
          destinationAddress: payload.data.destinationAddress,
          amount: payload.data.amount,
          netAmount: payload.data.netAmount,
          networkFee: payload.data.networkFee,
          status: payload.data.status,
        },
      );
    }
  }
}

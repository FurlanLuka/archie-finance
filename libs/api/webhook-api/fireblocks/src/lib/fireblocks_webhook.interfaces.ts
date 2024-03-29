import { TransactionResponse } from 'fireblocks-sdk';
import { FireblocksWebhookDto } from './fireblocks_webhook.dto';

export enum EventType {
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_STATUS_UPDATED = 'TRANSACTION_STATUS_UPDATED',
  TRANSACTION_APPROVAL_STATUS_UPDATED = 'TRANSACTION_APPROVAL_STATUS_UPDATED',
  VAULT_ACCOUNT_ADDED = 'VAULT_ACCOUNT_ADDED',
  VAULT_ACCOUNT_ASSET_ADDED = 'VAULT_ACCOUNT_ASSET_ADDED',
  INTERNAL_WALLET_ASSET_ADDED = 'INTERNAL_WALLET_ASSET_ADDED',
  EXTERNAL_WALLET_ASSET_ADDED = 'EXTERNAL_WALLET_ASSET_ADDED',
  EXCHANGE_ACCOUNT_ADDED = 'EXCHANGE_ACCOUNT_ADDED',
  FIAT_ACCOUNT_ADDED = 'FIAT_ACCOUNT_ADDED',
  NETWORK_CONNECTION_ADDED = 'NETWORK_CONNECTION_ADDED',
}

interface FireblocksWebhookTransactionCreated extends FireblocksWebhookDto {
  type: EventType.TRANSACTION_CREATED;
  data: TransactionResponse;
}

interface FireblocksWebhookTransactionStatusUpdated
  extends FireblocksWebhookDto {
  type: EventType.TRANSACTION_STATUS_UPDATED;
  data: TransactionResponse;
}

interface FireblocksWebhookTransactionApprovalStatusUpdated
  extends FireblocksWebhookDto {
  type: EventType.TRANSACTION_APPROVAL_STATUS_UPDATED;
  data: TransactionResponse;
}

export type FireblocksWebhookPayload =
  | FireblocksWebhookTransactionCreated
  | FireblocksWebhookTransactionStatusUpdated
  | FireblocksWebhookTransactionApprovalStatusUpdated;

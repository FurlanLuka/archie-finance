export enum NetAsset {
  positive = 'positive',
  negative = 'negative',
}

export enum TransactionStatus {
  queued = 'queued',
  pending = 'pending',
  settled = 'settled',
  failed = 'failed',
}

export enum TransactionType {
  atm_withdrawal = 'atm_withdrawal',
  card_purchase = 'card_purchase',
  card_refund = 'card_refund',
  dispute = 'dispute',
  external_transfer = 'external_transfer',
  fee = 'fee',
  credit = 'credit',
  internal_transfer = 'internal_transfer',
  other = 'other',
  reversed_transfer = 'reversed_transfer',
  third_party_transfer = 'third_party_transfer',
}

export class RizeTransactionDto {
  adjustment_uid: string | null;
  created_at: string;
  custodial_account_uids: string[];
  debit_card_uid: string | null;
  description: string;
  destination_synthetic_account_uid: string;
  id: number;
  initial_action_at: string;
  mcc: string | null;
  merchant_location: string | null;
  merchant_name: string | null;
  merchant_number: string | null;
  denial_reason: string | null;
  net_asset: NetAsset;
  settled_at: string | null;
  settled_index: number;
  source_synthetic_account_uid: string;
  status: TransactionStatus;
  transaction_event_uids: string[];
  transfer_uid: string | null;
  type: TransactionType;
  uid: string;
  us_dollar_amount: string;
}

export class TransactionUpdatedPayload extends RizeTransactionDto {
  userId: string;
}

export class CardActivatedPayload {
  userId: string;
  customerId: string;
}

export class CollateralReceivedPayload {
  userId: string;
}

export class CollateralDepositCompletedPayload {
  userId: string;
  asset: string;
  amount: string;
  transactionId: string;
}

export class CollateralLiquidationInitiatedPayload {
  userId: string;
  collateral: {
    asset: string;
    amount: string;
    price: number;
  }[];
}

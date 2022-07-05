export interface TransactionResponse {
  created_at: string;
  settled_at: string;
  description: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
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
  internal_transfer = 'internal_transfer',
  other = 'other',
  reversed_transfer = 'reversed_transfer',
  third_party_transfer = 'third_party_transfer',
}

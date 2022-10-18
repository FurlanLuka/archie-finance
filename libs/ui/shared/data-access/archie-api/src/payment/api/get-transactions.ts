import { API_URL } from '@archie-microservices/ui/shared/constants';

import { getRequest } from '../../helpers';
import { PaginationMeta } from '../../interface';

export enum NetAsset {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

export enum TransactionStatus {
  QUEUED = 'queued',
  PENDING = 'pending',
  SETTLED = 'settled',
  FAILED = 'failed',
}

export enum TransactionType {
  ATM_WITHDRAWAL = 'atm_withdrawal',
  CARD_PURCHASE = 'card_purchase',
  CARD_REFUND = 'card_refund',
  DISPUTE = 'dispute',
  EXTERNAL_TRANSFER = 'external_transfer',
  FEE = 'fee',
  CREDIT = 'credit',
  INTERNAL_TRANSFER = 'internal_transfer',
  OTHER = 'other',
  REVERSED_TRANSFER = 'reversed_transfer',
  THIRD_PARTY_TRANSFER = 'third_party_transfer',
  BALANCE_PAYMENT = 'balance_payment', // custom not on the BE (yet)
}

export interface Transaction {
  description: string;
  type: TransactionType;
  status: TransactionStatus;
  us_dollar_amount: string;
  settled_at: string;
  created_at: string;
  is_adjustment: boolean;
  mcc: string | null;
  merchant_location: string | null;
  merchant_name: string | null;
  merchant_number: string | null;
  denial_reason: string | null;
  net_asset: NetAsset;
}

export const ERROR_LIST = new Map<string, string>([]);

export interface GetTransactionsResponse {
  meta: PaginationMeta;
  data: Transaction[];
}

export const getTransactions = async (
  page: number,
  pageSize: number,
  accessToken: string,
): Promise<GetTransactionsResponse> => {
  return getRequest<GetTransactionsResponse>(
    `${API_URL}/v1/rize/users/transactions?page=${page}&limit=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};

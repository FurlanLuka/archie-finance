import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';
import { PaginationMeta } from '../../interface';

export enum NetAsset {
  positive = 'positive',
  negative = 'negative',
}

export enum TransactionStatus {
  QUEUED = 'queued',
  PENDING = 'pending',
  SETTLED = 'settled',
  FAILED = 'failed',
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

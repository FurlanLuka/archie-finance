import {
  NetAsset,
  TransactionStatus,
  TransactionType,
} from './api/rize_api.interfaces';

export interface Transaction {
  created_at: string;
  settled_at: string;
  description: string;
  type: TransactionType;
  status: TransactionStatus;
  us_dollar_amount: string;
  is_adjustment: boolean;
  mcc: string | null;
  merchant_location: string | null;
  merchant_name: string | null;
  merchant_number: string | null;
  denial_reason: string | null;
  net_asset: NetAsset;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  count: number;
}

export interface TransactionResponse {
  meta: PaginationMeta;
  data: Transaction[];
}

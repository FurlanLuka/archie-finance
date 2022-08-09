import {
  PaginationMeta,
  Transaction,
  TransactionResponse,
} from './rize.interfaces';
import { IsNumber, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  NetAsset,
  RizeTransaction,
  TransactionStatus,
  TransactionType,
} from './api/rize_api.interfaces';

export class TransactionResponseDto implements TransactionResponse {
  meta: PaginationMetaDto;
  data: TransactionDto[];
}

class PaginationMetaDto implements PaginationMeta {
  totalCount: number;
  count: number;
  page: number;
  limit: number;
}

class TransactionDto implements Transaction {
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

export class GetTransactionsQueryDto {
  @IsNumber()
  @Type(() => Number)
  page = 0;
  @IsNumber()
  @Max(100)
  @Type(() => Number)
  limit = 100;
}

export class MarginCallCompletedDto {
  userId: string;
  liquidation: LiquidationDto[];
}

export class LiquidationDto {
  asset: string;
  amount: number;
  price: number;
}

export class MarginCallStartedDto {
  userId: string;
}

export class CreditLimitDto {
  userId: string;
  amount: number;
}

export class CardActivatedPayload {
  userId: string;
  customerId: string;
}

export class CardImageResponseDto {
  image: string;
}

export class FundsLoadedPayload {
  userId: string;
  amount: number;
}

export class RizeTransactionDto implements RizeTransaction {
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

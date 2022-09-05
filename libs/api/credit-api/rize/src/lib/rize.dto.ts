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
  settled_at: string | null;
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

export enum CardStatus {
  active = 'active',
  frozen = 'frozen',
}

export class CardResponseDto {
  image: string;
  status: CardStatus;
  freezeReason: string | null;
}

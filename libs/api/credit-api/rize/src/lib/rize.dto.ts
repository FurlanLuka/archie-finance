import { TransactionResponse } from './rize.interfaces';
import { IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
  NetAsset,
  TransactionStatus,
  TransactionType,
} from './api/rize_api.interfaces';

export class TransactionResponseDto implements TransactionResponse {
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
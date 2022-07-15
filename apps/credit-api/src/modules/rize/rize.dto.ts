import {
  TransactionResponse,
  TransactionStatus,
  TransactionType,
} from './rize.interfaces';
import { IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionResponseDto implements TransactionResponse {
  description: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  settled_at: string;
  created_at: string;
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

export class CardActivatedDto {
  userId: string;
  customerId: string;
}

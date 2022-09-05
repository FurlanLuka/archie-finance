import {
  PurchaseStatus,
  PurchaseTransactionType,
  PurchaseType,
} from '../api/peach_api.interfaces';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseDetailsDto {
  mcc: string;
  merchantLocation: string;
  merchantName: string;
  merchantNumber: string;
  @ApiProperty({ enum: PurchaseTransactionType, nullable: true })
  transactionType: PurchaseTransactionType | null;
}

export class PurchasesResponseDataDto {
  id: string;
  description: string;
  type: PurchaseType;
  status: PurchaseStatus;
  amount: number;
  denialReason: string | null;
  timestamps: {
    createdAt: string;
    settledAt: string | null;
  };
  purchaseDetails: PurchaseDetailsDto;
}

export class PurchasesResponseDto {
  meta: {
    total: number;
    count: number;
    nextUrl: string | null;
    previousUrl: string | null;
  };
  data: PurchasesResponseDataDto[];
}

export class GetPurchasesQueryDto {
  @IsString()
  @IsOptional()
  startingAfter?: string | null;

  @IsString()
  @IsOptional()
  endingBefore?: string | null;

  @IsNumber()
  @Type(() => Number)
  limit = 100;

  @IsDateString()
  @IsOptional()
  fromEffectiveDate?: string | null;

  @IsDateString()
  @IsOptional()
  toEffectiveDate?: string | null;
}

import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import {
  PaymentReason,
  PaymentStatus,
  PaymentType,
  TransactionType,
} from '../api/peach_api.interfaces';

export class GetPaymentsQueryDto {
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

export class PaymentsResponseDto {
  meta: {
    total: number;
    count: number;
    nextUrl: string | null;
    previousUrl: string | null;
  };
  data: {
    id: string;
    created_at: string;
    isExternal: boolean;
    status: PaymentStatus;
    transactionType: TransactionType;
    paymentDetails: {
      type: PaymentType;
      reason: PaymentReason;
      fromInstrumentId: string;
    };
    actualAmount: number;
    currency: string;
    failureDescriptionShort?: string;
    failureDescriptionLong?: string;
    autopayPlanId?: string;
    cancelReason?: string;
  }[];
}

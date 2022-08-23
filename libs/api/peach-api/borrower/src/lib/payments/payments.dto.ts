import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
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

export class PaymentResponseDataDto {
  id: string;
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
  timestamps: {
    createdAt: string;
    scheduledDate: string | null;
    succeededAt: string | null;
    failedAt: string | null;
    chargebackAt: string | null;
  };
}

export class PaymentsResponseDto {
  meta: {
    total: number;
    count: number;
    nextUrl: string | null;
    previousUrl: string | null;
  };
  data: PaymentResponseDataDto[];
}

const PEACH_ID_REGEX = /^ext-|^[A-Z]{2}-[A-Z0-9]+-[A-Z0-9]+|^\d+$/;

export class ScheduleTransactionDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string | null;

  @Matches(PEACH_ID_REGEX)
  paymentInstrumentId: string;
}

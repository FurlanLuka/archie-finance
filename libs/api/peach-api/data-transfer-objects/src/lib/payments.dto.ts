import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentResponseData, PaymentsResponse } from './payments.interfaces';
import { PaymentReason, PaymentStatus, TransactionPaymentType, TransactionType } from './peach-api.interfaces';
import { PEACH_ID_REGEX } from './shared.dto';

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

export class PaymentResponseDataDto implements PaymentResponseData {
  id: string;
  isExternal: boolean;
  status: PaymentStatus;
  transactionType: TransactionType;
  paymentDetails: {
    type: TransactionPaymentType;
    reason: PaymentReason;
    fromInstrumentId: string;
    paymentNetworkName: string;
    accountNumberLastFour?: string;
  };
  actualAmount: number;
  currency: string;
  failureDescriptionShort: string | null;
  failureDescriptionLong: string | null;
  autopayPlanId: string | null;
  cancelReason: string | null;
  timestamps: {
    createdAt: string;
    scheduledDate: string | null;
    succeededAt: string | null;
    failedAt: string | null;
    chargebackAt: string | null;
  };
}
export class PaymentsResponseDto implements PaymentsResponse {
  meta: {
    total: number;
    count: number;
    nextUrl: string | null;
    previousUrl: string | null;
  };
  data: PaymentResponseDataDto[];
}

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

import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentResponseData, PaymentsResponse } from './payments.interfaces';

// TODO solve this and peach-api/constants circular dependency
const PEACH_ID_REGEX = /^ext-|^[A-Z]{2}-[A-Z0-9]+-[A-Z0-9]+|^\d+$/;

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

export class PaymentsResponseDto implements PaymentsResponse {
  meta: {
    total: number;
    count: number;
    nextUrl: string | null;
    previousUrl: string | null;
  };
  data: PaymentResponseData[];
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

import { PEACH_ID_REGEX } from '@archie/api/peach-api/constants';
import { IsDateString, IsNumber, IsOptional, IsPositive, Matches } from 'class-validator';

class Obligation {
  capitalizedAmount: number;
  dueDate: string;
  fulfilledAmount: number;
  gracePeriod: string | null;
  isFulfilled: boolean;
  isOpen: boolean;
  isOverdue: boolean;
  obligationAmount: number;
  overpaymentsAmount: number;
  remainingAmount: number;
}

export class ObligationsResponseDto {
  daysOverdue: number;
  isOverdue: boolean;
  overdueAmount: number;
  obligations: Obligation[];
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

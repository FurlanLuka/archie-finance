import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

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

const PEACH_ID_REGEX = /^ext-|^[A-Z]{2}-[A-Z0-9]+-[A-Z0-9]+|^\d+$/;

export class ScheduleTransactionDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string | null;

  @Matches(PEACH_ID_REGEX)
  paymentInstrumentId: string;
}

export class ConnectAccountDto {
  @IsString()
  accountId: string;
  
  @IsString()
  publicToken: string;
}

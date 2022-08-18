import { IsDateString, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  amount: number;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string | null;
}

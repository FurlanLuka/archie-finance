import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

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
  @Min(0.01)
  amount: number;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string | null;
}

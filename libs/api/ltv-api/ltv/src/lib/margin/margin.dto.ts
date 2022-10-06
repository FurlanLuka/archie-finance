import { IsEnum, IsOptional } from 'class-validator';

export enum MarginCallStatus {
  active = 'active',
  completed = 'completed',
}

export class MarginCallQueryDto {
  @IsOptional()
  @IsEnum(MarginCallStatus)
  status: MarginCallStatus | null = null;
}

export class MarginCallsDto {
  status: MarginCallStatus;
  automaticLiquidationAt: string;
  createdAt: string;
}

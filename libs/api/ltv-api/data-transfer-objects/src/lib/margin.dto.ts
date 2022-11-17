import { IsEnum, IsOptional } from 'class-validator';
import { MarginCall, MarginCallStatus } from './margin.interfaces';

export class MarginCallQueryDto {
  @IsOptional()
  @IsEnum(MarginCallStatus)
  status: MarginCallStatus | null = null;
}

export class MarginCallDto implements MarginCall {
  status: MarginCallStatus;
  automaticLiquidationAt: string;
  createdAt: string;
}

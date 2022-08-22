import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPaymentsQueryDto {
  @IsString()
  @IsOptional()
  startingAfter: string;

  @IsString()
  @IsOptional()
  endingBefore: string;

  @IsNumber()
  @Type(() => Number)
  limit = 100;
}

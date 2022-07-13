import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CollateralWithdrawInitializedDto {
  @IsString()
  asset: string;
  @IsNumber()
  withdrawalAmount: number;
  @IsString()
  userId: string;
  @IsString()
  destinationAddress: string;
}

class LiquidationDto {
  @IsString()
  asset: string;
  @IsString()
  amount: string;
  @IsString()
  price: string;
}

export class LiquidateAssetsDto {
  @IsString()
  userId: string;
  @IsArray()
  @Type(() => LiquidationDto)
  liquidation: LiquidationDto[];
}

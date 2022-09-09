import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { AssetType } from '@archie/api/collateral-api/asset-information';

export class CollateralWithdrawInitializedDto {
  @IsString()
  asset: string;
  @IsNumber()
  withdrawalAmount: number;
  @IsString()
  userId: string;
  @IsString()
  destinationAddress: string;
  @IsString()
  withdrawalId: string;
}

class LiquidationDto {
  @IsString()
  asset: string;
  @IsNumber()
  amount: number;
  @IsNumber()
  price: number;
}

export class LiquidateAssetsDto {
  @IsString()
  userId: string;
  @IsArray()
  @Type(() => LiquidationDto)
  liquidation: LiquidationDto[];
}

export class InternalCollateralTransactionCreatedPayload {
  userId: string;
  id: string;
  amount: number;
  price: number;
  network: AssetType;
  asset: string;
}

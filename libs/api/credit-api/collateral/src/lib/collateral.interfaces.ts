import { IsNumber, IsString } from 'class-validator';
import { TransactionStatus } from 'fireblocks-sdk';

export class GetCollateralResponse {
  asset: string;
  amount: number;
}

export class GetCollateralValueResponse {
  asset: string;
  assetAmount: number;
  price: number;
}

export class GetTotalCollateralValueResponse {
  value: number;
}

export class CollateralWithdrawDto {
  @IsString()
  asset: string;
  @IsNumber()
  withdrawalAmount: number;
  @IsString()
  destinationAddress: string;
}

export class CreateDepositDto {
  @IsString()
  transactionId: string;
  @IsString()
  userId: string;
  @IsString()
  asset: string;
  @IsNumber()
  amount: number;
  @IsString()
  destinationAddress: string;
  @IsString()
  status: TransactionStatus;
}

export class CollateralWithdrawCompletedDto {
  @IsString()
  transactionId: string;
  @IsString()
  userId: string;
  @IsString()
  asset: string;
  @IsNumber()
  withdrawalAmount: number;
  @IsString()
  destinationAddress: string;
  @IsString()
  status: TransactionStatus;
}

export class GetCollateralPayload {
  userId: string;
}

export class GetCollateralValuePayload {
  userId: string;
}

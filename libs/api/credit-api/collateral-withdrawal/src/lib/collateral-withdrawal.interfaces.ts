import { IsNumber, IsString } from 'class-validator';
import { TransactionStatus } from 'fireblocks-sdk';

export class CollateralWithdrawCreateDto {
  @IsString()
  asset: string;
  @IsNumber()
  withdrawalAmount: number;
  @IsString()
  destinationAddress: string;
}

export class GetCollateralWithdrawalResponse {
  id: string;
  asset: string;
  currentAmount: number;
  withdrawalAmount: number;
  destinationAddress: string;
  fee: number | null;
  status: TransactionStatus;
  createdAt: Date;
}

export class GetUserMaxWithdrawalAmountResponse {
  maxAmount: number;
}

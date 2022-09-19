import { IsNumber, IsString } from 'class-validator';
import { TransactionStatus } from 'fireblocks-sdk';

export class CollateralWithdrawCreateDto {
  @IsString()
  asset: string;
  @IsString() // TODO: add number regex
  withdrawalAmount: string;
  @IsString()
  destinationAddress: string;
}

export class GetCollateralWithdrawalResponse {
  id: string;
  asset: string;
  currentAmount: string;
  withdrawalAmount: string;
  destinationAddress: string;
  fee: string | null;
  status: TransactionStatus;
  createdAt: Date;
}

export class GetUserMaxWithdrawalAmountResponse {
  maxAmount: number;
}

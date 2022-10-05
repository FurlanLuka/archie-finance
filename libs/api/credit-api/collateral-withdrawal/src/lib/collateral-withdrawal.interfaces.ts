import { IsString, Matches } from 'class-validator';
import { TransactionStatus } from 'fireblocks-sdk';

export class CollateralWithdrawCreateDto {
  @IsString()
  asset: string;
  @Matches(/^\d+((.)|(.\d{0,18})?)$/)
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
  maxAmount: string;
}

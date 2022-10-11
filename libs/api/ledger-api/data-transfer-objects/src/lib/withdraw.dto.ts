import { IsString, Matches } from 'class-validator';

export class MaxWithdrawalAmountResponse {
  maxAmount: string;
}

export interface WithdrawalRecord {
  assetId: string;
  status: string;
  networkFee: string | null;
  amount: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WithdrawPayloadDto {
  @IsString()
  assetId: string;

  @Matches(/^\d+((.)|(.\d{0,18})?)$/)
  amount: string;

  @IsString()
  destinationAddress: string;
}

export class WithdrawResponseDto {
  id: string;
}

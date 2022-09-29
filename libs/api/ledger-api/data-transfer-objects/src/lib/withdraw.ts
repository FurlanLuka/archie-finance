import { IsString } from 'class-validator';

export interface MaxWithdrawalAmountResponse {
  maxAmount: string;
}

export interface GetWithdrawalLog {
  assetId: string;
  status: string;
  amount: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WithdrawPayloadDto {
  @IsString()
  assetId: string;

  @IsString()
  amount: string;

  @IsString()
  destinationAddress: string;
}

export interface WithdrawResponseDto {
  id: string;
}

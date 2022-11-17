import { IsString, Matches } from 'class-validator';
import {
  MaxWithdrawalAmountResponse,
  WithdrawPayload,
  WithdrawResponse,
} from './withdraw.interfaces';

export class MaxWithdrawalAmountResponseDto
  implements MaxWithdrawalAmountResponse
{
  maxAmount: string;
}

export class WithdrawPayloadDto implements WithdrawPayload {
  @IsString()
  assetId: string;

  @Matches(/^\d+((.)|(.\d{0,18})?)$/)
  amount: string;

  @IsString()
  destinationAddress: string;
}

export class WithdrawResponseDto implements WithdrawResponse {
  id: string;
}

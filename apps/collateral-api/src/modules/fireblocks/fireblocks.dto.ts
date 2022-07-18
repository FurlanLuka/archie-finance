import { IsNumber, IsString } from 'class-validator';

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

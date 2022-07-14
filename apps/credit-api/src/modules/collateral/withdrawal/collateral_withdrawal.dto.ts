import { IsNumber, IsString } from "class-validator";
import { TransactionStatus } from "fireblocks-sdk";


export class CollateralWithdrawDto {
  @IsString()
  asset: string;
  @IsNumber()
  withdrawalAmount: number;
  @IsString()
  destinationAddress: string;
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

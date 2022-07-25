import { IsNumber, IsString } from 'class-validator';

export class CollateralWithdrawCreateDto {
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
}

export class CollateralWithdrawTransactionCreatedDto {
  @IsString()
  transactionId: string;
  @IsString()
  withdrawalId: string;
}

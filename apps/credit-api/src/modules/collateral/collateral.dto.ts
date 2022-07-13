import {
  Collateral,
  CollateralValue,
  GetTotalCollateralValueResponse,
} from '@archie-microservices/api-interfaces/collateral';
import { IsNumber, IsString } from 'class-validator';
import { TransactionStatus } from 'fireblocks-sdk';

export class CollateralDto implements Collateral {
  asset: string;
  amount: number;
}

export class CollateralValueDto implements CollateralValue {
  asset: string;
  assetAmount: number;
  price: number;
}

export class GetTotalCollateralValueResponseDto
  implements GetTotalCollateralValueResponse
{
  value: number;
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

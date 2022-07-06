import {
  Collateral,
  CollateralValue,
  GetTotalCollateralValueResponse,
} from '@archie-microservices/api-interfaces/collateral';
import { IsNumber, IsString } from 'class-validator';

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

export class CollateralWithdrawDto {
  @IsString()
  asset: string;
  @IsNumber()
  withdrawalAmount: number;
  @IsString()
  destinationAddress: string;
}

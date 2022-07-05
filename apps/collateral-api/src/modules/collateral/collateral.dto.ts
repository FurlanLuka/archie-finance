import {
  Collateral,
  CollateralValue,
  CollateralWithdrawal,
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

export class CollateralWithdrawDto implements CollateralWithdrawal {
  @IsString()
  asset: string;
  @IsNumber()
  amount: number;
  @IsString()
  destinationAddress: string;
}

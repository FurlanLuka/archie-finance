import {
    Collateral,
    CollateralValue,
    GetTotalCollateralValueResponse
} from '@archie-microservices/api-interfaces/collateral';

export class CollateralDto implements Collateral {
    asset: string;
    amount: number;
}

export class CollateralValueDto implements CollateralValue {
    asset: string;
    assetAmount: number;
    price: number;
}

export class GetTotalCollateralValueResponseDto implements GetTotalCollateralValueResponse {
    value: number;
};

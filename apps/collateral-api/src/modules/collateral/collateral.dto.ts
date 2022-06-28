import * as i from '@archie-microservices/api-interfaces/collateral';

export class Collateral implements i.Collateral {
    asset: string;
    amount: number;
}

export class CollateralValue implements i.CollateralValue {
    asset: string;
    assetAmount: number;
    price: number;
}

export class GetTotalCollateralValueResponse implements i.GetTotalCollateralValueResponse {
    value: number;
};

import * as i from '@archie-microservices/api-interfaces/asset_price';

export class GetAssetPriceResponse implements i.GetAssetPriceResponse {
    asset: string;
    price: number;
    currency: string;
}
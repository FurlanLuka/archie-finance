import { GetAssetPriceResponse } from '@archie-microservices/api-interfaces/asset_price';

export class GetAssetPriceResponseDto implements GetAssetPriceResponse {
    asset: string;
    price: number;
    currency: string;
}
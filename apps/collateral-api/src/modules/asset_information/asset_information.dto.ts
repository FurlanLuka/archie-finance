import * as i from '@archie-microservices/api-interfaces/asset_information';

export class GetAssetListResponse implements i.GetAssetListResponse {
    [key: string]: AssetInformation;
}

class AssetInformation implements i.AssetInformation {
    fireblocks_id: string;
    coinapi_id: string;
    network: i.AssetType;
    ltv: number;
    interest: number;
}

export class GetAssetInformationResponse extends AssetInformation {}
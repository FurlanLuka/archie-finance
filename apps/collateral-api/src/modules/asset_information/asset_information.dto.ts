import {
  AssetInformation,
  AssetType,
  GetAssetListResponse,
} from '@archie-microservices/api-interfaces/asset_information';

export class GetAssetListResponseDto implements GetAssetListResponse {
  [key: string]: AssetInformationDto;
}

class AssetInformationDto implements AssetInformation {
  fireblocks_id: string;
  coinapi_id: string;
  network: AssetType;
  ltv: number;
  interest: number;
  liquidation_wallet: string;
}

export class GetAssetInformationResponseDto extends AssetInformationDto {}

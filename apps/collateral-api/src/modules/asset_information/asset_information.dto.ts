import {
  AssetInformation,
  AssetType,
  GetAssetListResponse,
} from '@archie/api/utils/interfaces/asset_information';

export class GetAssetListResponseDto implements GetAssetListResponse {
  [key: string]: AssetInformationDto;
}

class AssetInformationDto implements AssetInformation {
  fireblocks_id: string;
  coinapi_id: string;
  network: AssetType;
  ltv: number;
  interest: number;
}

export class GetAssetInformationResponseDto extends AssetInformationDto {}

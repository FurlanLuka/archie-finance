export enum AssetType {
  ERC20 = 'ERC20',
  SOL = 'SOL',
  BTC = 'BTC',
}

export interface AssetList {
  [key: string]: AssetInformation;
}

export interface AssetInformation {
  fireblocks_id: string;
  coinapi_id: string;
  network: AssetType;
  ltv: number;
  interest: number;
  liquidation_wallet: string;
}

export type GetAssetListResponse = AssetList;
export type GetAssetInformationResponse = AssetInformation;

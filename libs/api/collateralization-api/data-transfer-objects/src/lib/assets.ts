export enum AssetType {
  ERC20 = 'ERC20',
  SOL = 'SOL',
  BTC = 'BTC',
}

export class AssetInformation {
  fireblocksId: string;
  coingeckoId: string;
  network: 'ERC20' | 'SOL' | 'BTC';
  ltv: number;
  interest: number;
  liquidationWalletAddress: string;
}

export class AssetList {
  [key: string]: AssetInformation;
}

export class GetAssetPriceResponse {
  asset: string;
  price: number;
  dailyChange: number;
  currency: string;
}

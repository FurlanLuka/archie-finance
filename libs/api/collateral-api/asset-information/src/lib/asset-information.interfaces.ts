export enum AssetType {
  ERC20 = 'ERC20',
  SOL = 'SOL',
  BTC = 'BTC',
}

export interface AssetInformation {
  fireblocks_id: string;
  coingecko_id: string;
  network: AssetType;
  ltv: number;
  interest: number;
  liquidation_wallet: string;
}

export interface AssetList {
  [key: string]: AssetInformation | undefined;
}

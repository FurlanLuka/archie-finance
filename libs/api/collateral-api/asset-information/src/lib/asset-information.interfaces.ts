export enum AssetType {
  ERC20 = 'ERC20',
  SOL = 'SOL',
  BTC = 'BTC',
}

export class AssetList {
  [key: string]: AssetInformation;
}

export class AssetInformation {
  fireblocks_id: string;
  coingecko_id: string;
  network: AssetType;
  ltv: number;
  interest: number;
  liquidation_wallet: string;
}

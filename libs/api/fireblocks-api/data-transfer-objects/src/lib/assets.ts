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
  id: string;
}

export class AssetList {
  [key: string]: Omit<AssetInformation, 'id'>;
}

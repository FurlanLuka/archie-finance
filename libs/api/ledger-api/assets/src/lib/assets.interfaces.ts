export interface AssetInformation {
  coingeckoId: string;
  liquidationWalletId: string;
  liquidationWeight: number;
  id: string;
}

export type AssetList = AssetInformation[];

export interface AssetInformation {
  coingeckoId: string;
  liquidationWalletId: string;
  liquidationWeight: string;
  id: string;
}

export type AssetList = AssetInformation[];

export interface AssetInformation {
  coingeckoId: string;
  liquidationWeight: number;
  decimalPlaces: number;
  id: string;
}

export type AssetList = AssetInformation[];

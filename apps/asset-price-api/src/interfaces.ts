export interface AssetList {
  [key: string]: AssetInformation;
}

interface AssetInformation {
  fireblocks_id: string;
  coingecko_id: string;
  network: string;
  ltv: number;
  interest: number;
}

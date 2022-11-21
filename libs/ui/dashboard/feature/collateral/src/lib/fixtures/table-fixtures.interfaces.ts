export type AssetValue = {
  collateralAsset: string;
  balance: string;
  holdings: string;
  allocation: number;
  change: {
    collateralAsset: string;
  };
  actions: {
    collateralAsset: string;
    isHolding: boolean;
  };
};

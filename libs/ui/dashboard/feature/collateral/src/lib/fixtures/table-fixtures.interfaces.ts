export type AssetValue = {
  collateral_asset: string;
  balance: string;
  holdings: string;
  allocation: number;
  change: {
    collateral_asset: string;
  };
  actions: {
    collateral_asset: string;
    isHolding: boolean;
  };
};

export type AssetValue = {
  collateral_asset: string;
  balance: string;
  holdings: string;
  credit_limit: string;
  change: {
    collateral_asset: string;
  };
  allocation: number;
  actions: {
    collateral_asset: string;
    isHolding: boolean;
  };
};

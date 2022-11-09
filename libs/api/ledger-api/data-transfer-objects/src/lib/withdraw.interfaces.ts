export interface MaxWithdrawalAmountResponse {
  maxAmount: string;
}

export interface WithdrawalRecord {
  assetId: string;
  status: string;
  networkFee: string | null;
  amount: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WithdrawPayload {
  assetId: string;
  amount: string;
  destinationAddress: string;
}

export interface WithdrawResponse {
  id: string;
}

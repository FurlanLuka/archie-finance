export interface GetMaxWithdrawalAmount {
  maxAmount: string;
}

export interface GetWithdrawalLog {
  assetId: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  amount: string;
  createdAt: Date;
  updatedAt: Date;
}

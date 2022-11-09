export enum MarginCallStatus {
  active = 'active',
  completed = 'completed',
}

export interface MarginCall {
  status: MarginCallStatus;
  automaticLiquidationAt: string;
  createdAt: string;
}

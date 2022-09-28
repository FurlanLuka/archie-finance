export enum TransactionStatus {
  initiated = 'initiated',
  completed = 'completed',
}

export type AssetLtvList = Record<string, AssetLtv | undefined>;

export interface AssetLtv {
  ltv: number;
}

export interface LtvMeta {
  ledgerValue: number;
  creditUtilization: number;
}

export interface PerUserLtv {
  userId: string;
  ltv: number;
  ltvMeta: LtvMeta;
}

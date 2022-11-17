export interface LtvUpdatedPayload {
  userId: string;
  ltv: number;
}

export enum LtvStatus {
  good = 'good',
  ok = 'ok',
  warning = 'warning',
  margin_call = 'margin_call',
}

export interface Ltv {
  ltv: number;
  status: LtvStatus;
}

export enum LtvStatus {
  good = 'good',
  ok = 'ok',
  warning = 'warning',
  margin_call = 'margin_call',
}

export class LtvResponseDto {
  ltv: number;
  status: LtvStatus;
  loanedBalance: number;
}

import { LtvResponse, LtvStatus } from './margin.interfaces';

export class LtvResponseDto implements LtvResponse {
  ltv: number;
  status: LtvStatus;
  loanedBalance: number;
}

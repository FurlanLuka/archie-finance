import { Ltv, LtvStatus } from './ltv.interfaces';

export class LtvDto implements Ltv {
  ltv: number;
  status: LtvStatus;
}

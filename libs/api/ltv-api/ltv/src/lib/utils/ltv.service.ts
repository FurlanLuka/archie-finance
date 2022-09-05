import { Injectable } from '@nestjs/common';
import { LtvStatus } from '../ltv/ltv.dto';
import { CreditAssets } from './utils.interfaces';

@Injectable()
export class LtvUtilService {
  LTV_OK_LIMIT = 50;
  LTV_WARNING_LIMIT = 65;
  LTV_MARGIN_CALL_LIMIT = 75;

  public calculateLtv(
    creditAssets: CreditAssets,
    collateralValue: number,
  ): number {
    return (creditAssets.credit.utilizationAmount / collateralValue) * 100;
  }

  public getLtvStatus(ltv: number): LtvStatus {
    if (ltv < this.LTV_OK_LIMIT) return LtvStatus.good;
    else if (ltv < this.LTV_WARNING_LIMIT) return LtvStatus.ok;
    else if (ltv < this.LTV_MARGIN_CALL_LIMIT) return LtvStatus.warning;
    else return LtvStatus.margin_call;
  }
}

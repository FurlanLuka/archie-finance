import { Injectable } from '@nestjs/common';
import { LTV_MARGIN_CALL_LIMIT } from '@archie/api/ltv-api/constants';
import { LtvStatus } from '@archie/api/ltv-api/data-transfer-objects/types';

@Injectable()
export class LtvUtilService {
  LTV_OK_LIMIT = 50;
  LTV_WARNING_LIMIT = 65;

  public calculateLtv(
    creditUtilization: number,
    collateralValue: number,
  ): number {
    if (collateralValue === 0) {
      return 0;
    }

    return (creditUtilization / collateralValue) * 100;
  }

  public getLtvStatus(ltv: number): LtvStatus {
    if (ltv < this.LTV_OK_LIMIT) return LtvStatus.good;
    else if (ltv < this.LTV_WARNING_LIMIT) return LtvStatus.ok;
    else if (ltv < LTV_MARGIN_CALL_LIMIT) return LtvStatus.warning;
    else return LtvStatus.margin_call;
  }
}

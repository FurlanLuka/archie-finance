import { Injectable } from '@nestjs/common';
import { LtvBalances, MarginPrices } from './margin_action_handlers.interfaces';
import {
  COLLATERAL_SALE_LTV_LIMIT,
  LTV_MARGIN_CALL_LIMIT,
} from '@archie/api/margin-api/constants';

@Injectable()
export class MarginCallPriceFactory {
  public getMarginCallPrices(ltvCalculationInfo: LtvBalances): MarginPrices {
    return {
      priceForMarginCall:
        ltvCalculationInfo.utilizedCreditAmount / (LTV_MARGIN_CALL_LIMIT / 100),
      priceForPartialCollateralSale:
        ltvCalculationInfo.utilizedCreditAmount /
        (COLLATERAL_SALE_LTV_LIMIT / 100),
      collateralBalance: ltvCalculationInfo.collateralBalance,
    };
  }
}

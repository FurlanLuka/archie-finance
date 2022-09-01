import { Injectable } from '@nestjs/common';
import { LtvBalances, MarginPrices } from './margin_action_handlers.interfaces';

@Injectable()
export class MarginCallPriceFactory {
  LTV_MARGIN_CALL_LIMIT = 75;
  COLLATERAL_SALE_LTV_LIMIT = 85;

  public getMarginCallPrices(ltvCalculationInfo: LtvBalances): MarginPrices {
    return {
      priceForMarginCall:
        ltvCalculationInfo.utilizedCreditAmount /
        (this.LTV_MARGIN_CALL_LIMIT / 100),
      priceForPartialCollateralSale:
        ltvCalculationInfo.utilizedCreditAmount /
        (this.COLLATERAL_SALE_LTV_LIMIT / 100),
      collateralBalance: ltvCalculationInfo.collateralBalance,
    };
  }
}

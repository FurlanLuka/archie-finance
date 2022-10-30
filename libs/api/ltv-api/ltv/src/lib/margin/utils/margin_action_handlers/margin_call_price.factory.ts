import { Injectable } from '@nestjs/common';
import { MarginPrices } from './margin_action_handlers.interfaces';
import {
  COLLATERAL_SALE_LTV_LIMIT,
  LTV_MARGIN_CALL_LIMIT,
} from '@archie/api/ltv-api/constants';
import { LtvMeta } from '../../margin.interfaces';

@Injectable()
export class MarginCallPriceFactory {
  public getMarginCallPrices(ltvMeta: LtvMeta): MarginPrices {
    return {
      priceForMarginCall:
        ltvMeta.creditUtilization / (LTV_MARGIN_CALL_LIMIT / 100),
      priceForPartialCollateralSale:
        ltvMeta.creditUtilization / (COLLATERAL_SALE_LTV_LIMIT / 100),
      collateralBalance: ltvMeta.ledgerValue,
    };
  }
}

import { Injectable } from '@nestjs/common';
import {
  CollateralLiquidatedMail,
  MarginInfoMail,
} from './email-data-factory.interfaces';

@Injectable()
export class EmailDataFactoryService {
  private roundValue(price: number) {
    return price.toFixed(2);
  }

  public createCollateralLiquidatedMail<T extends CollateralLiquidatedMail>(
    firstName: string,
    marginCall: T,
  ) {
    return {
      firstName: firstName,
      liquidatedAmount: this.roundValue(marginCall.liquidationAmount),
      collateralValue: this.roundValue(marginCall.collateralBalance),
      ltv: this.roundValue(marginCall.ltv),
    };
  }

  public createInfoData<T extends MarginInfoMail>(
    firstName: string,
    marginCall: T,
  ) {
    return {
      firstName: firstName,
      collateralValue: this.roundValue(marginCall.collateralBalance),
      ltv: this.roundValue(marginCall.ltv),
      marginCallValue: this.roundValue(marginCall.priceForMarginCall),
      priceThatTriggersSale: this.roundValue(
        marginCall.priceForPartialCollateralSale,
      ),
    };
  }
}
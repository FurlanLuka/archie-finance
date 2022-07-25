import { Injectable } from '@nestjs/common';
import { GetKycResponse } from '@archie/api/utils/interfaces/kyc';
import {
  MarginCallBase,
  MarginCallCompleted,
} from '../../../../sendgrid/src/lib/sendgrid.interfaces';

@Injectable()
export class EmailDataFactoryService {
  private roundValue(price: number) {
    return price.toFixed(2);
  }

  public createCollateralLiquidatedMail(
    kyc: GetKycResponse,
    marginCall: MarginCallCompleted,
  ) {
    return {
      firstName: kyc.firstName,
      liquidatedAmount: this.roundValue(marginCall.liquidationAmount),
      collateralValue: this.roundValue(marginCall.collateralBalance),
      ltv: this.roundValue(marginCall.ltv),
    };
  }

  public createInfoData<T extends MarginCallBase>(
    kyc: GetKycResponse,
    marginCall: T,
  ) {
    return {
      firstName: kyc.firstName,
      collateralValue: this.roundValue(marginCall.collateralBalance),
      ltv: this.roundValue(marginCall.ltv),
      marginCallValue: this.roundValue(marginCall.priceForMarginCall),
      priceThatTriggersSale: this.roundValue(
        marginCall.priceForPartialCollateralSale,
      ),
    };
  }
}

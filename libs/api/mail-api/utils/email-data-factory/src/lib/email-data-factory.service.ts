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

<<<<<<< HEAD
  public createCollateralLiquidatedMail(
    kyc: GetKycResponse,
    marginCall: MarginCallCompleted,
=======
  public createCollateralLiquidatedMail<T extends CollateralLiquidatedMail>(
    firstName: string,
    marginCall: T,
>>>>>>> a1729f1... Fix circular dependency (interfaces)
  ) {
    return {
      firstName: kyc.firstName,
      liquidatedAmount: this.roundValue(marginCall.liquidationAmount),
      collateralValue: this.roundValue(marginCall.collateralBalance),
      ltv: this.roundValue(marginCall.ltv),
    };
  }

<<<<<<< HEAD
  public createInfoData<T extends MarginCallBase>(
    kyc: GetKycResponse,
=======
  public createInfoData<T extends MarginInfoMail>(
    firstName: string,
>>>>>>> a1729f1... Fix circular dependency (interfaces)
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

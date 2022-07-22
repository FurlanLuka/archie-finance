import {
  Liquidation,
  LtvLimitApproaching,
  MarginCallBase,
  MarginCallCompleted,
  MarginCallStarted,
} from './sendgrid.interfaces';

export class AppliedToWaitlistDto {
  emailAddress: string;
  verifyAddress: string;
}

export class JoinedWaitlistDto {
  emailAddress: string;
}

class MarginCallBaseDto implements MarginCallBase {
  userId: string;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
  ltv: number;
}

export class MarginCallCompletedDto
  extends MarginCallBaseDto
  implements MarginCallCompleted
{
  liquidation: LiquidationDto[];
  liquidationAmount: number;
}

export class LiquidationDto implements Liquidation {
  asset: string;
  amount: number;
  price: number;
}

export class MarginCallStartedDto
  extends MarginCallBaseDto
  implements MarginCallStarted {}

export class LtvLimitApproachingDto
  extends MarginCallBaseDto
  implements LtvLimitApproaching {}

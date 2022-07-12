import { Liquidation } from './sendgrid.interfaces';

export class AppliedToWaitlistDto {
  emailAddress: string;
  verifyAddress: string;
}

export class JoinedWaitlistDto {
  emailAddress: string;
}

export class MarginCallCompletedDto {
  userId: string;
  liquidation: LiquidationDto[];
}

export class LiquidationDto implements Liquidation {
  asset: string;
  amount: number;
  price: number;
}

export class MarginCallStartedDto {
  userId: string;
}

export class LtvLimitApproachingDto {
  userId: string;
  ltv: number;
}

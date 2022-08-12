import { Credit } from './api/peach_api.interfaces';

export class CreditLinePaymentReceivedPayload implements Credit {
  userId: string;
  availableCreditAmount: number;
  creditLimitAmount: number;
  calculatedAt: string;
}

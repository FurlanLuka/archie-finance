import { GetCreditResponse } from './credit.interfaces';

export class GetCreditResponseDto implements GetCreditResponse {
  totalCredit: number;
  availableCredit: number;
}

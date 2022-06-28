import * as i from './credit.interfaces';

export class GetCreditResponse implements i.GetCreditResponse {
    totalCredit: number;
    availableCredit: number;
}
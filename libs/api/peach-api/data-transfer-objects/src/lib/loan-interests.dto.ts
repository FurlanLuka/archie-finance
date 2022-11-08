import { LoanInterests } from './loan-interests.interfaces';

export class LoanInterestsDto implements LoanInterests {
  aprNominal: number;
  aprEffective: number;
}

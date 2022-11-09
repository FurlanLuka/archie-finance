import { LoanBalances } from './loan-balances.interfaces';

export class LoanBalancesDto implements LoanBalances {
  isBalanceChangeInProgress: boolean;
  totalCredit: number;
  availableCredit: number;
  utilizationAmount: number;
}

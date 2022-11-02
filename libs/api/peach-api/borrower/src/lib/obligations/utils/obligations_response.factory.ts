import { Injectable } from '@nestjs/common';
import { ObligationsResponseDto } from '../obligations.dto';
import { Balances, Obligation } from '@archie/api/peach-api/data-transfer-objects/types';

@Injectable()
export class ObligationsResponseFactory {
  public create(
    balances: Balances,
    dueObligations: Obligation[],
    futureObligations: Obligation[],
  ): ObligationsResponseDto {
    return {
      outstandingBalances: balances.outstandingBalances,
      overdueBalances: balances.overdueBalances,
      dueBalances: balances.dueBalances,
      statementObligations: dueObligations.map((obligation: Obligation) => ({
        capitalizedAmount: obligation.capitalizedAmount,
        dueDate: obligation.dueDate,
        fulfilledAmount: obligation.fulfilledAmount,
        gracePeriod: obligation.gracePeriod,
        isOverdue: obligation.isOverdue,
        obligationAmount: obligation.obligationAmount,
        overpaymentsAmount: obligation.overpaymentsAmount,
        remainingAmount: obligation.remainingAmount,
      })),
      futureObligations: futureObligations.map((obligation: Obligation) => ({
        capitalizedAmount: obligation.capitalizedAmount,
        dueDate: obligation.dueDate,
        fulfilledAmount: obligation.fulfilledAmount,
        gracePeriod: obligation.gracePeriod,
        isOverdue: obligation.isOverdue,
        obligationAmount: obligation.obligationAmount,
        overpaymentsAmount: obligation.overpaymentsAmount,
        remainingAmount: obligation.remainingAmount,
      })),
    };
  }
}

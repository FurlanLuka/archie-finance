import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getObligations, Obligation } from '../api/get-obligations';
import { UserObligations } from '../payment.interfaces';

export const OBLIGATIONS_RECORD_QUERY_KEY = 'obligations_record';

export const useGetObligations = (): QueryResponse<UserObligations> => {
  return useExtendedQuery(OBLIGATIONS_RECORD_QUERY_KEY, async (accessToken: string) => {
    const obligationsResponse = await getObligations(accessToken);

    return {
      dueDate: obligationsResponse.futureObligations[0]?.dueDate ?? '',
      balanceOwed: obligationsResponse.statementObligations.reduce(
        (sum, obligation: Obligation) => sum + obligation.remainingAmount,
        0,
      ),
      fullBalance: obligationsResponse.outstandingBalances.outstandingTotalAmount,
      interestOwed: obligationsResponse.outstandingBalances.outstandingInterestAmount,
    };
  });
};

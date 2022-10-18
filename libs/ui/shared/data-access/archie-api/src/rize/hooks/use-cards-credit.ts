import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getCardsCredit, CardsCredit } from '../api/get-cards-credit';

export const CARDS_CREDIT_RECORD_QUERY_KEY = 'cards_credit_record';

export const useGetCardsCredit = (): QueryResponse<CardsCredit> => {
  return useExtendedQuery(
    CARDS_CREDIT_RECORD_QUERY_KEY,
    async (accessToken: string) => getCardsCredit(accessToken),
  );
};

import { ApiError } from '../../api-error';
import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getAutopay } from '../api/get-autopay';
import { Autopay, AUTOPAY_NOT_CONFIGURED } from '../autopay.interfaces';

export const AUTOPAY_RECORD_QUERY_KEY = 'autopay_record';

export const useGetAutopay = (): QueryResponse<Autopay | null> => {
  return useExtendedQuery(
    AUTOPAY_RECORD_QUERY_KEY,
    async (accessToken: string) => {
      try {
        const response = await getAutopay(accessToken);
        return response;
      } catch (err) {
        if (err instanceof ApiError) {
          if (
            err.statusCode === 404 &&
            err.message === AUTOPAY_NOT_CONFIGURED
          ) {
            return null;
          }
        }

        throw err;
      }
    },
  );
};

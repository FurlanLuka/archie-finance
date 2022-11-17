import { CardResponse } from '@archie/api/credit-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getCardsCredit = async (
  accessToken: string,
): Promise<CardResponse> => {
  return getRequest<CardResponse>(
    `${API_URL}/v1/rize/users/cards/credit`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};

import { API_URL } from '@archie/ui/shared/constants';
import { CardStatus } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export interface CardsCredit {
  image: string;
  status: CardStatus;
  freezeReason: string | null;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getCardsCredit = async (
  accessToken: string,
): Promise<CardsCredit> => {
  return getRequest<CardsCredit>(
    `${API_URL}/v1/rize/users/cards/credit`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};

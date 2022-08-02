import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface CardsImage {
  image: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getCardsImage = async (accessToken: string): Promise<CardsImage> => {
  return getRequest<CardsImage>(
    `${API_URL}/v1/rize/users/cards/image`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};

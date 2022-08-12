import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getCardsImage, CardsImage } from '../api/get-cards-image';

export const CARDS_IMAGE_RECORD_QUERY_KEY = 'cards_image_record';

export const useGetCardsImage = (): QueryResponse<CardsImage> => {
  return useExtendedQuery(CARDS_IMAGE_RECORD_QUERY_KEY, async (accessToken: string) =>
    getCardsImage(accessToken),
  );
};

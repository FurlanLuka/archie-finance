import { Onboarding } from '@archie/api/onboarding-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

const ERROR_LIST = new Map([
  [
    'ONBOARDING_NOT_FOUND',
    'Onboarding record was not found. Please contact support.',
  ],
]);

export const getOnboarding = async (
  accessToken: string,
): Promise<Onboarding> => {
  return getRequest<Onboarding>(
    `${API_URL}/v1/onboarding`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};

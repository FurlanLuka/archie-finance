import { API_URL } from '@archie-microservices/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export const createCreditLine = async ({
  accessToken,
}: DefaultVariables): Promise<unknown> => {
  return postRequest(
    `${API_URL}/v1/credit_limits`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    new Map([]),
  );
};

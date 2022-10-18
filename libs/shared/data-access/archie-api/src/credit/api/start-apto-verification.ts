import { API_URL } from '@archie-microservices/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export const startAptoVerification = async ({
  accessToken,
}: DefaultVariables): Promise<unknown> => {
  return postRequest(
    `${API_URL}/v1/apto/verification/start`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    new Map([]),
  );
};

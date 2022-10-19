import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export const createRizeUser = async ({
  accessToken,
}: DefaultVariables): Promise<unknown> => {
  return postRequest(
    `${API_URL}/v1/rize/users`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    new Map([]),
  );
};

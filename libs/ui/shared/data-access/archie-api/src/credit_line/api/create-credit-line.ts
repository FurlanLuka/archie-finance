import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export const createCreditLine = async ({
  accessToken,
}: DefaultVariables): Promise<unknown> => {
  return postRequest(
    `${API_URL}/v2/credit_lines`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    new Map([]),
  );
};

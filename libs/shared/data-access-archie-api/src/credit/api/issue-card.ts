import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export const issueCard = async ({ accessToken }: DefaultVariables): Promise<unknown> => {
  return postRequest(
    `${API_URL}/v1/apto/user/card`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    new Map([]),
  );
};

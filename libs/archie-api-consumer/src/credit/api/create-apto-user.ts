import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export const createAptoUser = async ({ accessToken }: DefaultVariables): Promise<unknown> => {
  return postRequest(
    `${API_URL}/v1/apto/user`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    new Map([]),
  );
};

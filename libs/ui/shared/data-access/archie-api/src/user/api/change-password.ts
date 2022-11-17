import { AUTH0_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export interface ChangePasswordPayload extends DefaultVariables {
  email: string;
  connection: string;
  client_id: string;
}

const ERROR_LIST = new Map([
  ['INVALID_EMAIL', 'This email does not exist among the Archie accounts.'],
]);

export const changePassword = async ({
  accessToken,
  ...payload
}: ChangePasswordPayload): Promise<void> => {
  return postRequest(
    `${AUTH0_URL}/dbconnections/change_password`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};

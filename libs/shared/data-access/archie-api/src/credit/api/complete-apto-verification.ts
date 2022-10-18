import { API_URL } from '@archie-webapps/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export interface CompleteAptoVerificationPayload extends DefaultVariables {
  secret?: string;
}

export const completeAptoVerification = async ({
  accessToken,
  ...payload
}: CompleteAptoVerificationPayload): Promise<unknown> => {
  return postRequest(
    `${API_URL}/v1/apto/verification/finish`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    new Map([]),
  );
};

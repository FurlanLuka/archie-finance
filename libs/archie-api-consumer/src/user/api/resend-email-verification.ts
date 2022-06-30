import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

const ERROR_LIST = new Map([['EMAIL_ALREADY_VERIFIED', 'Your email has already been verified.']]);

export const resendEmailVerification = async ({ accessToken }: DefaultVariables): Promise<void> => {
  return postRequest<unknown, void>(
    `${API_URL}/v1/user/email-verification/resend`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};

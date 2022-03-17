import { API_URL } from 'apps/archie-auth/src/constants';
import axios from 'axios';

export const verifyMfa = async (
  sessionToken: string,
  totp: string,
): Promise<void> => {
  await axios.post(`${API_URL}/v1/mfa/verification/verify/${sessionToken}`, {
    totp,
  });
};

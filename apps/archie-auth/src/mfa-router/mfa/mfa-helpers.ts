import { API_URL } from 'apps/archie-auth/src/constants';
import axios from 'axios';
import { useMutation } from 'react-query';

export const verifyMfa = async (
  sessionToken: string,
  totp: string,
): Promise<void> => {
  await axios.post(`${API_URL}/v1/verification/verify/${sessionToken}`, {
    totp,
  });
};
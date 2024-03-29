import { CreditLine } from '@archie/api/credit-line-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getCreditLine = async (
  accessToken: string,
): Promise<CreditLine> => {
  return getRequest<CreditLine>(
    `${API_URL}/v2/credit_lines`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};

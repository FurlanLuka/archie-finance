import { Statement } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getStatements = async (
  accessToken: string,
): Promise<Statement[]> => {
  return getRequest<Statement[]>(
    `${API_URL}/v1/loan_statements`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};

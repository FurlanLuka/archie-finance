import { LoanDocument } from '@archie/api/peach-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getStatementDocument = async (accessToken: string, documentId: string): Promise<LoanDocument> => {
  return getRequest<LoanDocument>(
    `${API_URL}/v1/loan_statements/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};

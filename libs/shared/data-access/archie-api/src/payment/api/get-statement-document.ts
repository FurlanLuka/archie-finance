import { API_URL } from '@archie-webapps/shared/constants';

import { getRequest } from '../../helpers';

export interface StatementDocument {
  url: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getStatementDocument = async (accessToken: string, documentId: string): Promise<StatementDocument> => {
  return getRequest<StatementDocument>(
    `${API_URL}/v1/loan_statements/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};

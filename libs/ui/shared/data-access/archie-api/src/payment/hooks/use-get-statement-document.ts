import { LoanDocument } from '@archie/api/peach-api/data-transfer-objects/types';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getStatementDocument } from '../api/get-statement-document';

export const useGetStatementDocument = (
  documentId: string,
): QueryResponse<LoanDocument> => {
  const STATEMENT_DOCUMENT_RECORD_QUERY_KEY = [
    'statement_document',
    documentId,
  ];

  return useExtendedQuery(
    STATEMENT_DOCUMENT_RECORD_QUERY_KEY,
    async (accessToken: string) =>
      getStatementDocument(accessToken, documentId),
    { enabled: false },
  );
};

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import {
  getStatementDocument,
  StatementDocument,
} from '../api/get-statement-document';

export const useGetStatementDocument = (
  documentId: string,
): QueryResponse<StatementDocument> => {
  const STATEMENT_DOCUMENT_RECORD_QUERY_KEY = `statement_document_${documentId}_record`;

  return useExtendedQuery(
    STATEMENT_DOCUMENT_RECORD_QUERY_KEY,
    async (accessToken: string) =>
      getStatementDocument(accessToken, documentId),
    { enabled: false },
  );
};

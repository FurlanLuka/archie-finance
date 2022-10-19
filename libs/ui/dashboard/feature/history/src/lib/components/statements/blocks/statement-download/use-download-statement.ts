import { useAsyncEffect } from 'use-async-effect';

import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetStatementDocument } from '@archie/ui/shared/data-access/archie-api/payment/hooks/use-get-statement-document';

interface UseDownloadStatementResult {
  downloadDocument: () => void;
  isLoading: boolean;
}

export function useDownloadStatement(
  documentId: string,
): UseDownloadStatementResult {
  const getStatementDocumentResponse = useGetStatementDocument(documentId);

  const downloadDocument = () => {
    if (getStatementDocumentResponse.state === RequestState.IDLE) {
      getStatementDocumentResponse.fetch();
    }
  };

  useAsyncEffect(
    async (isMounted) => {
      if (
        isMounted() &&
        getStatementDocumentResponse.state === RequestState.SUCCESS
      ) {
        window.location.href = getStatementDocumentResponse.data.url;
      }
    },
    [getStatementDocumentResponse],
  );

  return {
    isLoading: getStatementDocumentResponse.state === RequestState.LOADING,
    downloadDocument,
  };
}

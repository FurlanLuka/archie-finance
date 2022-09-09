import { useAsyncEffect } from 'use-async-effect';

import { useDownloadFile } from '@archie-webapps/archie-dashboard/hooks';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useGetStatementDocument } from '@archie-webapps/shared/data-access/archie-api/payment/hooks/use-get-statement-document';

interface UseDownloadStatementResult {
  downloadDocument: () => void;
  isLoading: boolean;
}
export function useDownloadStatement(documentId: string): UseDownloadStatementResult {
  const { downloadFile, loading } = useDownloadFile();
  const getStatementDocumentResponse = useGetStatementDocument(documentId);

  function downloadDocument() {
    if (getStatementDocumentResponse.state === RequestState.IDLE) {
      getStatementDocumentResponse.fetch();
    }
  }

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted() && getStatementDocumentResponse.state === RequestState.SUCCESS) {
        await downloadFile(documentId, `${documentId}.pdf`);
      }
    },
    [getStatementDocumentResponse],
  );

  return {
    isLoading: loading || getStatementDocumentResponse.state === RequestState.LOADING,
    downloadDocument,
  };
}

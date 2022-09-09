import { useState } from 'react';

interface UseDownloadFileResult {
  loading: boolean;
  downloadFile: (fileUrl: string, fileName: string) => Promise<void>;
  error: boolean;
}

// since <a download> doesnt work for files that are not from the same domain, we need to click an invisible link
// courtesy of https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
export function useDownloadFile(): UseDownloadFileResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function downloadFile(fileUrl: string, fileName: string) {
    try {
      setLoading(true);
      const fileBlob = await fetch(fileUrl).then((res) => res.blob());
      setLoading(false);

      const blobURL = URL.createObjectURL(fileBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobURL;
      downloadLink.setAttribute('download', fileName);
      downloadLink.setAttribute('style', 'display: none');

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading file', error);
      setLoading(false);
      setError(true);
    }
  }

  return {
    loading,
    error,
    downloadFile,
  };
}

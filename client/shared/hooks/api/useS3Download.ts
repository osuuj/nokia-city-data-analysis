import { useState } from 'react';

export const useS3Download = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = async (key: string, filename?: string): Promise<boolean> => {
    const bucketUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL;

    if (!bucketUrl) {
      setError('S3 bucket URL not configured');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `${bucketUrl}/${key}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || key.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsLoading(false);
      return false;
    }
  };

  return { downloadFile, isLoading, error };
};

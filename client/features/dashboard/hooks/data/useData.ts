import { useEffect, useState } from 'react';

interface DataResponse {
  data: string;
}

interface UseDataResult {
  data: DataResponse | null;
  error: string | null;
  loading: boolean;
}

/**
 * Custom hook to fetch data from an API
 * @returns {UseDataResult} The data, error, and loading state
 */
export function useData(): UseDataResult {
  const [data, setData] = useState<DataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, error, loading };
}

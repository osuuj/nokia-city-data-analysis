import type React from 'react';
import { useEffect } from 'react';
import { useApiRequest } from '../../hooks/useApi';
import ApiErrorDisplay from '../error/ApiErrorDisplay';

interface DataFetcherProps<T> {
  endpoint: string;
  params?: Record<string, string | number | boolean>;
  renderData: (data: T) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
}

/**
 * A reusable component for fetching data from an API endpoint
 * with automatic loading and error handling
 *
 * @example
 * ```tsx
 * <DataFetcher
 *   endpoint="/companies/businesses_by_city"
 *   params={{ city: selectedCity }}
 *   renderData={(data) => <BusinessTable businesses={data} />}
 *   renderLoading={() => <CustomLoadingSpinner />}
 *   renderEmpty={() => <NoDataMessage />}
 * />
 * ```
 */
function DataFetcher<T extends unknown[]>({
  endpoint,
  params,
  renderData,
  renderLoading,
  renderEmpty,
}: DataFetcherProps<T>) {
  const { data, loading, error, execute } = useApiRequest<T>(endpoint);

  // Fetch data when component mounts or when params change
  useEffect(() => {
    const fetchData = async () => {
      await execute({ params });
    };
    fetchData();
  }, [params, execute]);

  if (loading) {
    return renderLoading ? (
      <>{renderLoading()}</>
    ) : (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return <ApiErrorDisplay error={error} onRetry={() => execute({ params })} />;
  }

  if (!data || data.length === 0) {
    return renderEmpty ? (
      <>{renderEmpty()}</>
    ) : (
      <div className="text-center py-6 text-gray-500">No data found</div>
    );
  }

  return <>{renderData(data)}</>;
}

export default DataFetcher;

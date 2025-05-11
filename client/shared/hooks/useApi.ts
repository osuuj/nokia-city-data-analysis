import { useCallback, useState } from 'react';
import { type ApiError, ApiErrorType, apiClient } from '../utils/api';

interface ApiHookState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

// Define a more specific type for API parameters
type ApiArgs = Record<string, unknown>;

interface ApiHookResult<T> extends ApiHookState<T> {
  execute: (args?: ApiArgs) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook for making API calls with automatic loading and error state management
 *
 * @param apiFn The API function to call
 * @returns Object containing data, loading, error states and execute function
 *
 * @example
 * ```tsx
 * // In your component
 * const { data, loading, error, execute } = useApi(
 *   (city: string) => apiClient.get<BusinessData[]>(`/companies/businesses_by_city?city=${city}`)
 * );
 *
 * // Execute the API call
 * useEffect(() => {
 *   if (selectedCity) {
 *     execute(selectedCity);
 *   }
 * }, [selectedCity, execute]);
 *
 * // Handle loading and error states
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * // Use the data
 * return <DataTable data={data || []} />;
 * ```
 */
export function useApi<T>(apiFn: (args?: ApiArgs) => Promise<T>): ApiHookResult<T> {
  const [state, setState] = useState<ApiHookState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (args?: ApiArgs): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });

      try {
        const data = await apiFn(args);
        setState({ data, loading: false, error: null });
        return data;
      } catch (err) {
        const error = err as ApiError;
        setState({ data: null, loading: false, error });
        return null;
      }
    },
    [apiFn],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// Define type for request options
interface RequestOptions {
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
  [key: string]: unknown;
}

/**
 * Hook for creating a reusable API request with options
 *
 * @param endpoint The API endpoint to call
 * @param method The HTTP method to use
 * @returns Object containing data, loading, error states and execute function
 *
 * @example
 * ```tsx
 * // In your component
 * const { data, loading, error, execute } = useApiRequest<BusinessData[]>(
 *   '/companies/businesses_by_city',
 *   'GET'
 * );
 *
 * // Execute the API call with params
 * useEffect(() => {
 *   if (selectedCity) {
 *     execute({ params: { city: selectedCity } });
 *   }
 * }, [selectedCity, execute]);
 * ```
 */
export function useApiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
): ApiHookResult<T> & {
  isNetworkError: boolean;
  isServerError: boolean;
} {
  const {
    data,
    loading,
    error,
    execute: baseExecute,
    reset,
  } = useApi<T>((options?: RequestOptions) => {
    switch (method) {
      case 'GET':
        return apiClient.get<T>(endpoint, options);
      case 'POST':
        return apiClient.post<T>(endpoint, options?.data, options);
      case 'PUT':
        return apiClient.put<T>(endpoint, options?.data, options);
      case 'DELETE':
        return apiClient.delete<T>(endpoint, options);
      default:
        return apiClient.get<T>(endpoint, options);
    }
  });

  // Provide helper methods for error type checking
  const isNetworkError = error?.type === ApiErrorType.NETWORK;
  const isServerError = error?.type === ApiErrorType.SERVER;

  return {
    data,
    loading,
    error,
    execute: baseExecute,
    reset,
    isNetworkError,
    isServerError,
  };
}

export default useApi;

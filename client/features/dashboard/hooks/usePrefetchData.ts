import { API_ENDPOINTS } from '@shared/api';
import apiClient from '@shared/api';
import { createQueryKey } from '@shared/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook to prefetch dashboard data
 */
export function usePrefetchData() {
  const queryClient = useQueryClient();

  /**
   * Prefetch cities data
   */
  const prefetchCities = async () => {
    await queryClient.prefetchQuery({
      queryKey: createQueryKey('cities'),
      queryFn: () => apiClient.get(API_ENDPOINTS.CITIES.LIST),
    });
  };

  /**
   * Prefetch companies data for a city
   */
  const prefetchCompanies = async (city: string) => {
    await queryClient.prefetchQuery({
      queryKey: createQueryKey('companies', { city }),
      queryFn: () =>
        apiClient.get(API_ENDPOINTS.COMPANIES.LIST, {
          params: { city },
        }),
    });
  };

  /**
   * Prefetch company details
   */
  const prefetchCompany = async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: createQueryKey('company', id),
      queryFn: () => apiClient.get(API_ENDPOINTS.COMPANIES.DETAIL(id)),
    });
  };

  /**
   * Prefetch city statistics
   */
  const prefetchCityStatistics = async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: createQueryKey('city-statistics', id),
      queryFn: () => apiClient.get(API_ENDPOINTS.CITIES.STATISTICS(id)),
    });
  };

  /**
   * Prefetch company statistics
   */
  const prefetchCompanyStatistics = async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: createQueryKey('company-statistics', id),
      queryFn: () => apiClient.get(API_ENDPOINTS.COMPANIES.STATISTICS(id)),
    });
  };

  return {
    prefetchCities,
    prefetchCompanies,
    prefetchCompany,
    prefetchCityStatistics,
    prefetchCompanyStatistics,
  };
}

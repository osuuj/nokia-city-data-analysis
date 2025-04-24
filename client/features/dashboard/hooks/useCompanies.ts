import { API_ENDPOINTS } from '@shared/api';
import { createQueryKey, useApiQuery } from '@shared/hooks/useApi';

/**
 * Company data type
 */
export interface Company {
  id: string;
  name: string;
  industry: string;
  industry_letter?: string;
  addresses?: {
    [key: string]: {
      latitude: number;
      longitude: number;
      address: string;
    };
  };
  employees?: number;
  revenue?: number;
  founded?: number;
}

/**
 * Hook to fetch all companies
 */
export function useCompanies(params?: {
  city?: string;
  industry?: string;
  limit?: number;
  offset?: number;
}) {
  return useApiQuery<Company[]>(
    createQueryKey('companies', params),
    API_ENDPOINTS.COMPANIES.LIST,
    {
      params: params as Record<string, string | number>,
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );
}

/**
 * Hook to fetch a specific company by ID
 */
export function useCompany(id: string) {
  return useApiQuery<Company>(
    createQueryKey('company', id),
    API_ENDPOINTS.COMPANIES.DETAIL(id),
    undefined,
    {
      enabled: !!id,
    },
  );
}

/**
 * Hook to fetch company statistics
 */
export function useCompanyStatistics(id: string) {
  return useApiQuery<{
    totalEmployees: number;
    revenue: number;
    growthRate: number;
    industryRank: number;
  }>(createQueryKey('company-statistics', id), API_ENDPOINTS.COMPANIES.STATISTICS(id), undefined, {
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

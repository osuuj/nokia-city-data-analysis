import type { CompanyProperties } from '@/features/dashboard/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '../useDebounce';

interface UseFilteredBusinessesProps {
  data: CompanyProperties[] | null;
  industries: string[];
  searchQuery: string;
  debounceMs?: number;
}

/**
 * Custom hook for filtering business data based on industries and search query.
 */
export function useFilteredBusinesses({
  data,
  industries,
  searchQuery,
  debounceMs = 300,
}: UseFilteredBusinessesProps) {
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, debounceMs);

  // Reset loading state when search changes
  useEffect(() => {
    setLoading(true);

    // Simulate an API call delay for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  /**
   * Memoized filtered businesses based on industries and search query
   */
  const filteredBusinesses = useMemo(() => {
    if (!data) {
      return [];
    }

    let filtered = [...data];

    // Filter by selected industries
    if (industries.length > 0) {
      filtered = filtered.filter((business) => {
        return industries.includes(business.industry_letter);
      });
    }

    // Filter by search query
    if (debouncedSearch.trim() !== '') {
      const lowerCaseSearch = debouncedSearch.toLowerCase();
      filtered = filtered.filter((business) => {
        return (
          business.company_name?.toLowerCase().includes(lowerCaseSearch) ||
          business.business_id?.toLowerCase().includes(lowerCaseSearch) ||
          business.industry?.toLowerCase().includes(lowerCaseSearch)
        );
      });
    }

    return filtered;
  }, [data, industries, debouncedSearch]);

  return {
    filteredBusinesses,
    loading,
    debouncedSearch,
  };
}

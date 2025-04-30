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
    if (searchQuery) {
      setLoading(true);

      // Simulate an API call delay for better UX
      const timer = setTimeout(() => {
        setLoading(false);
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [searchQuery]);

  // More efficient search implementation
  const searchCompanies = useCallback((companies: CompanyProperties[], query: string) => {
    if (!query.trim()) return companies;

    const lowerCaseQuery = query.toLowerCase();
    return companies.filter((business) => {
      // Check company name (most common search)
      if (business.company_name?.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }

      // Check business ID
      if (business.business_id?.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }

      // Check industry (less priority)
      if (business.industry?.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }

      // Additional search on address if available
      const visitingAddress = business.addresses?.['Visiting address'];
      if (
        visitingAddress &&
        typeof visitingAddress.street === 'string' &&
        visitingAddress.street.toLowerCase().includes(lowerCaseQuery)
      ) {
        return true;
      }

      return false;
    });
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
      filtered = searchCompanies(filtered, debouncedSearch);
    }

    return filtered;
  }, [data, industries, debouncedSearch, searchCompanies]);

  return {
    filteredBusinesses,
    loading,
    debouncedSearch,
  };
}

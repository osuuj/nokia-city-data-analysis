import { useCallback, useMemo, useState } from 'react';

interface UseSearchFilterProps<T extends Record<string, unknown>> {
  data: T[];
  searchFields: (keyof T)[];
  initialSearchTerm?: string;
  debounceMs?: number;
}

interface UseSearchFilterResult<T extends Record<string, unknown>> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredData: T[];
  isSearching: boolean;
}

/**
 * Custom hook for handling search filtering
 *
 * @param data - The data to filter
 * @param searchFields - The fields to search in
 * @param initialSearchTerm - The initial search term
 * @param debounceMs - Debounce time in milliseconds
 * @returns Search state and filtered data
 */
export function useSearchFilter<T extends Record<string, unknown>>({
  data,
  searchFields,
  initialSearchTerm = '',
  debounceMs = 300,
}: UseSearchFilterProps<T>): UseSearchFilterResult<T> {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term
  useMemo(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Get filtered data
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return data;

    const searchTermLower = debouncedSearchTerm.toLowerCase();

    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (value == null) return false;

        return String(value).toLowerCase().includes(searchTermLower);
      });
    });
  }, [data, debouncedSearchTerm, searchFields]);

  // Handle search term change
  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    filteredData,
    isSearching,
  };
}

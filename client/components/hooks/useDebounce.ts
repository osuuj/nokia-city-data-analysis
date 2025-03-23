import { useEffect, useState } from 'react';

/**
 * useDebounce
 * Delays updating the returned value until after the specified delay (ms).
 *
 * @param value - The input value to debounce
 * @param delay - Delay time in milliseconds
 * @returns The debounced value
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 300);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

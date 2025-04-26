import { useCallback, useEffect, useState } from 'react';

/**
 * A hook that delays updating the returned value until after the specified delay (ms).
 * Useful for reducing the frequency of expensive operations like API calls or complex calculations.
 *
 * @template T - The type of the value being debounced
 * @param value - The input value to debounce
 * @param delay - Delay time in milliseconds (default: 300ms)
 * @param options - Optional configuration options
 * @param options.leading - Whether to update the value immediately on the first call (default: false)
 * @param options.trailing - Whether to update the value after the delay (default: true)
 * @returns An object containing the debounced value and loading state
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { value: debouncedSearch, isLoading } = useDebounce(searchTerm, 300);
 *
 * // With options
 * const { value: debouncedSearch, isLoading } = useDebounce(searchTerm, 300, {
 *   leading: true,
 *   trailing: true
 * });
 *
 * // Using in a component
 * function SearchComponent() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const { value: debouncedSearch, isLoading } = useDebounce(searchTerm, 300);
 *
 *   useEffect(() => {
 *     if (debouncedSearch) {
 *       // Perform search with debouncedSearch
 *       searchAPI(debouncedSearch);
 *     }
 *   }, [debouncedSearch]);
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         value={searchTerm}
 *         onChange={(e) => setSearchTerm(e.target.value)}
 *       />
 *       {isLoading && <span>Searching...</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDebounce<T>(
  value: T,
  delay = 300,
  options: { leading?: boolean; trailing?: boolean } = {},
): { value: T; isLoading: boolean } {
  const { leading = false, trailing = true } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Use useCallback to memoize the update function
  const updateValue = useCallback(() => {
    setDebouncedValue(value);
    setIsLoading(false);
  }, [value]);

  useEffect(() => {
    // Set loading state when value changes
    setIsLoading(true);

    // If leading is true, update immediately on first call
    if (leading) {
      updateValue();
      return;
    }

    // Set up the debounce timer
    const timer = setTimeout(() => {
      if (trailing) {
        updateValue();
      }
    }, delay);

    // Clean up the timer on unmount or when dependencies change
    return () => clearTimeout(timer);
  }, [delay, leading, trailing, updateValue]);

  return { value: debouncedValue, isLoading };
}

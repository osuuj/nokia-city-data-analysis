import { useCallback, useRef } from 'react';

/**
 * A hook that returns a stable, memoized version of the given callback that always refers to the latest version.
 * This is useful for passing stable functions to deeply memoized components or React Query dependencies.
 *
 * @template T - The type of the arguments array
 * @template R - The return type of the function
 * @param fn - The function to memoize
 * @param options - Optional configuration options
 * @param options.onError - Optional error handler function
 * @returns A memoized version of the input function
 *
 * @example
 * ```tsx
 * // Basic usage
 * const stableFn = useMemoizedCallback((value) => doSomething(value));
 *
 * // With error handling
 * const stableFn = useMemoizedCallback(
 *   (value) => doSomething(value),
 *   { onError: (error) => console.error('Error in memoized function:', error) }
 * );
 *
 * // Using in a component
 * function MyComponent() {
 *   const [data, setData] = useState(null);
 *
 *   const fetchData = useMemoizedCallback(
 *     async (id) => {
 *       try {
 *         const result = await api.fetchData(id);
 *         setData(result);
 *       } catch (error) {
 *         console.error('Failed to fetch data:', error);
 *       }
 *     },
 *     { onError: (error) => console.error('Error in fetchData:', error) }
 *   );
 *
 *   return (
 *     <button onClick={() => fetchData(123)}>Fetch Data</button>
 *   );
 * }
 * ```
 */
export function useMemoizedCallback<T extends unknown[], R>(
  fn: (...args: T) => R,
  options: { onError?: (error: unknown) => void } = {},
): (...args: T) => R {
  const fnRef = useRef(fn);
  const { onError } = options;

  // Update the ref to the latest function
  fnRef.current = fn;

  // Return a stable callback that always calls the latest function
  return useCallback(
    (...args: T): R => {
      try {
        return fnRef.current(...args);
      } catch (error) {
        // Call the error handler if provided
        onError?.(error);
        // Re-throw the error to maintain the original behavior
        throw error;
      }
    },
    [onError],
  );
}

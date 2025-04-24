import { useCallback, useRef } from 'react';

/**
 * useMemoizedCallback
 * Returns a stable, memoized version of the given callback that always refers to the latest version.
 *
 * Useful for passing stable functions to deeply memoized components or React Query deps.
 *
 * @param fn - The function to memoize
 * @returns A memoized version of the input function
 *
 * @example
 * const stableFn = useMemoizedCallback((value) => doSomething(value));
 */
export function useMemoizedCallback<T extends unknown[], R>(
  fn: (...args: T) => R,
): (...args: T) => R {
  const fnRef = useRef(fn);

  fnRef.current = fn;

  return useCallback((...args: T): R => {
    return fnRef.current(...args);
  }, []);
}

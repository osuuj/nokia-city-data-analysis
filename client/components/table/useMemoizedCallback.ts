import { useCallback, useRef } from 'react';

// ✅ Safe function type without `any`
type NoopFunction<T extends unknown[], R> = (...args: T) => R;

export function useMemoizedCallback<T extends unknown[], R>(
  fn: NoopFunction<T, R>,
): NoopFunction<T, R> {
  const fnRef = useRef(fn);

  // ✅ Always store the latest function
  fnRef.current = fn;

  // ✅ Stable callback with correct return type
  return useCallback((...args: T): R => {
    return fnRef.current(...args);
  }, []);
}

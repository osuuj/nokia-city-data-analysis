import { useMemo, useRef } from 'react';

type noop = (this: unknown, ...args: unknown[]) => unknown;

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

export function useMemoizedCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T): T {
  const fnRef = useRef(fn);

  useMemo(() => {
    fnRef.current = fn;
  }, [fn]);

  return useRef(((...args: Parameters<T>) => {
    return fnRef.current(...args);
  }) as T).current;
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;

  type DebouncedFunction = T & { cancel: () => void };

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  } as DebouncedFunction;

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  return debounced;
}

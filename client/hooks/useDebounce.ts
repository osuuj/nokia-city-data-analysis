import { useEffect, useState } from "react";

// see https://github.com/tannerlinsley/react-query/issues/293
// see https://usehooks.com/useDebounce/
export default function useDebounce<T>(
  value: T,
  delay: number,
  callback?: () => void
) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      if (typeof window !== "undefined") {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value);
          if (callback) {
            callback();
          }
        }, delay);

        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler);
        };
      }
    },
    [value, delay] // Only re-call effect if value, delay, or callback changes
  );

  return debouncedValue;
}

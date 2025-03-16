// Where to Use useMemoizedCallback
// Since this hook keeps function references stable across renders while ensuring they always point to the latest version, you should use it for event handlers and callback functions that are passed down to components.

// 1. Sorting Callbacks
// Replace handleMemberClick to ensure it doesn't change on re-renders but always has the latest sorting logic.
// 2. Pagination Handlers
// Replace onNextPage and onPreviousPage to ensure stable references without unnecessary re-renders.
// 3. Search and Filter Handlers
// Replace onSearchChange to ensure it remains stable while keeping the latest filtering logic.
// 4. Selection Handling
// Replace onSelectionChange to avoid unnecessary updates when selecting/deselecting table rows.
// 5. Rendering Cells
// Replace renderCell so that the function remains stable when rendering table cells dynamically, ensuring optimal performance.



import { useCallback, useRef } from "react";

// ✅ Safe function type without `any`
type NoopFunction<T extends unknown[], R> = (...args: T) => R;

export function useMemoizedCallback<T extends unknown[], R>(fn: NoopFunction<T, R>): NoopFunction<T, R> {
  const fnRef = useRef(fn);

  // ✅ Always store the latest function
  fnRef.current = fn;

  // ✅ Stable callback with correct return type
  return useCallback((...args: T): R => {
    return fnRef.current(...args);
  }, []);
}
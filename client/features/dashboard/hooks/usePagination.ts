import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Define page cache interface
interface PageCache<T> {
  dataId: string; // To track if data has changed
  pages: Record<number, T[]>;
  pageSize: number;
  totalItems: number;
}

// Constants for pagination performance tuning
const MAX_CACHE_SIZE = 5; // Maximum number of pages to cache at once

/**
 * Custom hook for handling pagination with high-performance for large datasets
 *
 * @param data The full dataset to paginate
 * @param currentPage The current page number (1-based)
 * @param rowsPerPage Number of items per page
 * @returns Object containing paginated data and pagination metadata
 */
export function usePagination<T extends { [key: string]: unknown }>(
  data: T[],
  currentPage: number,
  rowsPerPage: number,
  idField = 'id', // Field to use as unique identifier
) {
  // Track when data completely changes
  const [dataVersion, setDataVersion] = useState(0);

  // Cache reference to avoid recalculating for the same data
  const cacheRef = useRef<PageCache<T>>({
    dataId: '',
    pages: {},
    pageSize: 0,
    totalItems: 0,
  });

  // More stable way to calculate current values
  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);

  // Generate a stable data ID for change detection
  // Use a more reliable way that doesn't cause JSON stringify issues
  const dataFingerprint = `${totalItems}-${rowsPerPage}-${dataVersion}`;

  // Check if data array has fundamentally changed (different items, not just order)
  useEffect(() => {
    const oldFirstItem = cacheRef.current.pages[1]?.[0];
    const oldLastItem =
      cacheRef.current.pages[totalPages]?.[(totalItems % rowsPerPage || rowsPerPage) - 1];

    // If the first or last item has changed substantially, reset the cache
    if (
      oldFirstItem &&
      oldLastItem &&
      (oldFirstItem[idField] !== data[0]?.[idField] ||
        oldLastItem[idField] !== data[totalItems - 1]?.[idField])
    ) {
      setDataVersion((prev) => prev + 1);
    }
  }, [data, rowsPerPage, totalPages, totalItems, idField]);

  // Cleanup cache when cache gets too large
  const cleanupCache = useCallback(() => {
    if (Object.keys(cacheRef.current.pages).length > MAX_CACHE_SIZE) {
      // Keep current page and adjacent pages, remove others
      const pagesToKeep = new Set([safePage, safePage - 1, safePage + 1]);

      // Create a new pages object with only the pages we want to keep
      const newPages: Record<number, T[]> = {};

      for (const page of pagesToKeep) {
        if (page > 0 && page <= totalPages && cacheRef.current.pages[page]) {
          newPages[page] = cacheRef.current.pages[page];
        }
      }

      cacheRef.current.pages = newPages;
    }
  }, [safePage, totalPages]);

  // Effect to update cache when data changes
  useEffect(() => {
    // Reset cache if data or page size changes
    if (cacheRef.current.dataId !== dataFingerprint || cacheRef.current.pageSize !== rowsPerPage) {
      cacheRef.current = {
        dataId: dataFingerprint,
        pages: {},
        pageSize: rowsPerPage,
        totalItems,
      };
    }

    // Update the cache for the current page if needed
    if (!cacheRef.current.pages[safePage]) {
      cacheRef.current.pages[safePage] = data.slice(startIndex, endIndex);
    }

    // Cleanup cache if it's too large
    cleanupCache();

    // Prefetch adjacent pages for smoother navigation
    const prefetchAdjacentPages = () => {
      if (typeof window === 'undefined') return;

      // Use requestIdleCallback or setTimeout for prefetching based on browser support
      const scheduleWork =
        'requestIdleCallback' in window
          ? (window as { requestIdleCallback: (callback: () => void) => number })
              .requestIdleCallback
          : (cb: () => void) => setTimeout(cb, 200);

      scheduleWork(() => {
        // Prefetch next page
        if (safePage < totalPages && !cacheRef.current.pages[safePage + 1]) {
          const nextStartIndex = safePage * rowsPerPage;
          const nextEndIndex = Math.min(nextStartIndex + rowsPerPage, totalItems);
          cacheRef.current.pages[safePage + 1] = data.slice(nextStartIndex, nextEndIndex);
        }

        // Prefetch previous page
        if (safePage > 1 && !cacheRef.current.pages[safePage - 1]) {
          const prevStartIndex = (safePage - 2) * rowsPerPage;
          const prevEndIndex = prevStartIndex + rowsPerPage;
          cacheRef.current.pages[safePage - 1] = data.slice(prevStartIndex, prevEndIndex);
        }
      });
    };

    prefetchAdjacentPages();
  }, [
    data,
    safePage,
    totalPages,
    rowsPerPage,
    startIndex,
    endIndex,
    totalItems,
    dataFingerprint,
    cleanupCache,
  ]);

  // Return the paginated data and metadata
  return useMemo(() => {
    // Get the current page data from cache or calculate it if not available
    const paginated = cacheRef.current.pages[safePage] || data.slice(startIndex, endIndex);

    return {
      paginated,
      totalPages,
      startIndex,
      endIndex,
      totalItems,
      // Cache info for debugging if needed
      cacheInfo: {
        cachedPages: Object.keys(cacheRef.current.pages).length,
        currentCacheId: dataFingerprint,
      },
    };
  }, [data, safePage, totalPages, startIndex, endIndex, totalItems, dataFingerprint]);
}

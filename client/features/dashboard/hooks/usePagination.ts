import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Define page cache interface
interface PageCache<T> {
  dataId: string; // To track if data has changed
  pages: Record<number, T[]>;
  pageSize: number;
  totalItems: number;
}

// Constants for pagination performance tuning
const MAX_CACHE_SIZE = 5; // Maximum number of pages to cache
const FIXED_PAGE_SIZE = 20; // Fixed, optimized page size
const CHUNKING_THRESHOLD = 1000; // Threshold for using chunked processing
const CHUNK_SIZE = 200; // Size of chunks for processing large datasets

/**
 * Custom hook for high-performance pagination with progressive loading
 *
 * @param data The full dataset to paginate
 * @param currentPage The current page number (1-based)
 * @param idField Field to use as unique identifier
 * @returns Object containing paginated data and pagination metadata
 */
export function usePagination<T extends { [key: string]: unknown }>(
  data: T[],
  currentPage: number,
  // Use a fixed page size instead of a variable one
  idField = 'id',
) {
  // Track when data completely changes
  const [dataVersion, setDataVersion] = useState(0);

  // Track the processing status for large datasets
  const [processingStatus, setProcessingStatus] = useState<{
    inProgress: boolean;
    processedItems: number;
    totalToProcess: number;
  }>({ inProgress: false, processedItems: 0, totalToProcess: 0 });

  // Cache reference to avoid recalculating for the same data
  const cacheRef = useRef<PageCache<T>>({
    dataId: '',
    pages: {},
    pageSize: FIXED_PAGE_SIZE,
    totalItems: 0,
  });

  // More stable way to calculate current values
  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / FIXED_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * FIXED_PAGE_SIZE;
  const endIndex = Math.min(startIndex + FIXED_PAGE_SIZE, totalItems);

  // Generate a stable data ID for change detection
  const dataFingerprint = `${totalItems}-${FIXED_PAGE_SIZE}-${dataVersion}`;

  // Process large datasets in chunks to avoid blocking the main thread
  const processLargeDataset = useCallback((items: T[], forceProcess = false) => {
    if (items.length <= CHUNKING_THRESHOLD && !forceProcess) {
      return Promise.resolve(items);
    }

    return new Promise<T[]>((resolve) => {
      const result: T[] = [];
      const totalChunks = Math.ceil(items.length / CHUNK_SIZE);
      let currentChunk = 0;

      setProcessingStatus({
        inProgress: true,
        processedItems: 0,
        totalToProcess: items.length,
      });

      const processNextChunk = () => {
        const start = currentChunk * CHUNK_SIZE;
        const end = Math.min((currentChunk + 1) * CHUNK_SIZE, items.length);
        const chunk = items.slice(start, end);

        result.push(...chunk);
        currentChunk++;

        setProcessingStatus({
          inProgress: currentChunk < totalChunks,
          processedItems: end,
          totalToProcess: items.length,
        });

        if (currentChunk < totalChunks) {
          // Schedule next chunk processing in the next idle period
          if ('requestIdleCallback' in window) {
            (
              window as { requestIdleCallback: (callback: () => void) => number }
            ).requestIdleCallback(() => processNextChunk());
          } else {
            setTimeout(processNextChunk, 0);
          }
        } else {
          resolve(result);
        }
      };

      // Start processing
      processNextChunk();
    });
  }, []);

  // Check if data array has fundamentally changed
  useEffect(() => {
    const oldFirstItem = cacheRef.current.pages[1]?.[0];
    const oldLastItem =
      cacheRef.current.pages[totalPages]?.[(totalItems % FIXED_PAGE_SIZE || FIXED_PAGE_SIZE) - 1];

    // If the first or last item has changed substantially, reset the cache
    if (
      oldFirstItem &&
      oldLastItem &&
      (oldFirstItem[idField] !== data[0]?.[idField] ||
        oldLastItem[idField] !== data[totalItems - 1]?.[idField])
    ) {
      setDataVersion((prev) => prev + 1);
    }
  }, [data, totalPages, totalItems, idField]);

  // Cleanup cache when it gets too large
  const cleanupCache = useCallback(() => {
    if (Object.keys(cacheRef.current.pages).length > MAX_CACHE_SIZE) {
      // Keep current page and adjacent pages, remove others
      const pagesToKeep = new Set([safePage, safePage - 1, safePage + 1]);
      const newPages: Record<number, T[]> = {};

      for (const page of pagesToKeep) {
        if (page > 0 && page <= totalPages && cacheRef.current.pages[page]) {
          newPages[page] = cacheRef.current.pages[page];
        }
      }

      cacheRef.current.pages = newPages;
    }
  }, [safePage, totalPages]);

  // Load and cache the current page
  useEffect(() => {
    // If data has changed or page size has changed, reset the cache
    if (cacheRef.current.dataId !== dataFingerprint) {
      cacheRef.current = {
        dataId: dataFingerprint,
        pages: {},
        pageSize: FIXED_PAGE_SIZE,
        totalItems,
      };
    }

    // Update the cache for the current page if needed
    const loadCurrentPage = async () => {
      if (!cacheRef.current.pages[safePage]) {
        const pageData = data.slice(startIndex, endIndex);

        // For large datasets, process chunked to avoid UI freezing
        if (data.length > CHUNKING_THRESHOLD) {
          cacheRef.current.pages[safePage] = await processLargeDataset(pageData);
        } else {
          cacheRef.current.pages[safePage] = pageData;
        }
      }

      cleanupCache();
    };

    loadCurrentPage();

    // Prefetch adjacent pages for smoother navigation
    const prefetchAdjacentPages = () => {
      if (typeof window === 'undefined') return;

      // Use requestIdleCallback or setTimeout for prefetching
      const scheduleWork =
        'requestIdleCallback' in window
          ? (window as { requestIdleCallback: (callback: () => void) => number })
              .requestIdleCallback
          : (cb: () => void) => setTimeout(cb, 200);

      scheduleWork(() => {
        // Prefetch next page
        if (safePage < totalPages && !cacheRef.current.pages[safePage + 1]) {
          const nextStartIndex = safePage * FIXED_PAGE_SIZE;
          const nextEndIndex = Math.min(nextStartIndex + FIXED_PAGE_SIZE, totalItems);
          cacheRef.current.pages[safePage + 1] = data.slice(nextStartIndex, nextEndIndex);
        }

        // Prefetch previous page
        if (safePage > 1 && !cacheRef.current.pages[safePage - 1]) {
          const prevStartIndex = (safePage - 2) * FIXED_PAGE_SIZE;
          const prevEndIndex = prevStartIndex + FIXED_PAGE_SIZE;
          cacheRef.current.pages[safePage - 1] = data.slice(prevStartIndex, prevEndIndex);
        }
      });
    };

    prefetchAdjacentPages();
  }, [
    data,
    safePage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    dataFingerprint,
    cleanupCache,
    processLargeDataset,
  ]);

  // Return the paginated data and metadata
  return useMemo(() => {
    // Get the current page data from cache or calculate it
    const paginated = cacheRef.current.pages[safePage] || data.slice(startIndex, endIndex);

    return {
      paginated,
      totalPages,
      startIndex,
      endIndex,
      totalItems,
      pageSize: FIXED_PAGE_SIZE,
      processingStatus,
      // Cache info for debugging
      cacheInfo: {
        cachedPages: Object.keys(cacheRef.current.pages).length,
        currentCacheId: dataFingerprint,
      },
    };
  }, [
    data,
    safePage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    dataFingerprint,
    processingStatus,
  ]);
}

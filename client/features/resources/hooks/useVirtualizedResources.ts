'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Resource } from '../types';

interface UseVirtualizedResourcesOptions {
  items: Resource[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualizedItem {
  index: number;
  offsetTop: number;
  resource: Resource;
}

/**
 * Custom hook for virtualizing resource lists to improve performance
 * with large datasets.
 *
 * @param options Configuration options for virtualization
 * @returns Virtualized resources and scroll handling functions
 *
 * @example
 * const { virtualItems, totalHeight, scrollContainerProps } = useVirtualizedResources({
 *   items: resources,
 *   itemHeight: 100,
 *   containerHeight: 500,
 *   overscan: 5
 * });
 */
export function useVirtualizedResources({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualizedResourcesOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate the total height of all items
  const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight]);

  // Calculate which items should be visible based on scroll position
  const virtualItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + overscan,
    );

    const visibleItems: VirtualizedItem[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push({
        index: i,
        offsetTop: i * itemHeight,
        resource: items[i],
      });
    }

    return visibleItems;
  }, [items, itemHeight, scrollTop, containerHeight, overscan]);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  // Scroll to a specific item
  const scrollToItem = useCallback((index: number) => {
    const element = document.getElementById(`resource-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Props to pass to the scroll container
  const scrollContainerProps = {
    onScroll: handleScroll,
    style: {
      height: `${containerHeight}px`,
      overflow: 'auto',
      position: 'relative' as const,
    },
  };

  return {
    virtualItems,
    totalHeight,
    scrollContainerProps,
    scrollToItem,
  };
}

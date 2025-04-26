'use client';

import { memo } from 'react';
import { useVirtualizedResources } from '../hooks/useVirtualizedResources';
import type { Resource } from '../types';
import { ResourceCard } from './ResourceCard';

interface VirtualizedResourceListProps {
  resources: Resource[];
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  className?: string;
}

/**
 * A component that efficiently renders a large list of resources using virtualization.
 * Only renders the resources that are currently visible in the viewport, plus a small
 * overscan area to ensure smooth scrolling.
 *
 * @param props Component props
 * @returns A virtualized list of resources
 *
 * @example
 * <VirtualizedResourceList
 *   resources={resources}
 *   itemHeight={100}
 *   containerHeight={500}
 *   overscan={5}
 * />
 */
export const VirtualizedResourceList = memo(function VirtualizedResourceList({
  resources,
  itemHeight = 100,
  containerHeight = 500,
  overscan = 5,
  className = '',
}: VirtualizedResourceListProps) {
  const { virtualItems, totalHeight, scrollContainerProps } = useVirtualizedResources({
    items: resources,
    itemHeight,
    containerHeight,
    overscan,
  });

  return (
    <div {...scrollContainerProps} className={className}>
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        {virtualItems.map(({ index, offsetTop, resource }) => (
          <div
            key={resource.id}
            id={`resource-${index}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${offsetTop}px)`,
            }}
          >
            <ResourceCard resource={resource} />
          </div>
        ))}
      </div>
    </div>
  );
});

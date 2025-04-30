# ViewSwitcher Implementation Plan

## Overview
The ViewSwitcher component is responsible for switching between different view modes (table, map, split, analytics) and maintaining consistent state between views. This document outlines the plan for consolidating the duplicate implementations and creating a more robust component.

## Current Issues
1. There are multiple ViewSwitcher implementations with overlapping functionality
2. The map view is not displaying properly in map or split modes
3. The table is not showing in split view mode
4. Data is not properly shared between views

## Implementation Steps

### 1. Consolidate Component Structure

```tsx
// ViewSwitcher.tsx
'use client';

import type { ViewSwitcherProps } from '@/features/dashboard/types';
import { Suspense, lazy } from 'react';
import { AnalyticsCardSkeleton } from '../analytics-skeletons';
import { TableSkeleton } from '../table/skeletons/TableSkeleton';

// Lazy load components for code splitting
const AnalyticsView = lazy(() => import('@/features/dashboard/views/AnalyticsView').then(m => ({default: m.AnalyticsView})));
const MapView = lazy(() => import('@/features/dashboard/components/map/MapView').then(m => ({default: m.MapView})));
const TableView = lazy(() => import('@/features/dashboard/components/table/TableView').then(m => ({default: m.TableView})));

export function ViewSwitcher({
  data,
  geojson,
  viewMode,
  /* other props */
}: ViewSwitcherProps) {
  // Implementation
}
```

### 2. Ensure Proper Data Flow

- Update the ViewSwitcher to use the GeoJSON data hooks:

```tsx
// Inside the component
const { data: geojsonData, isLoading } = useGeoJSONData(selectedCity);
```

- Transform the data for the map:

```tsx
const transformedGeoJSON = useMemo(() => {
  if (!geojsonData) return { type: 'FeatureCollection', features: [] };
  return transformCompanyGeoJSON(geojsonData);
}, [geojsonData]);
```

### 3. Fix Table View Rendering

- Ensure the Table component can display both in full and split modes:

```tsx
// Inside ViewSwitcher
{viewMode === 'table' && (
  <Suspense fallback={<TableSkeleton />}>
    <TableView
      data={data}
      /* other props */
    />
  </Suspense>
)}
```

### 4. Fix Map View Rendering

- Fix the Map component rendering:

```tsx
{viewMode === 'map' && geojson && (
  <div className="h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] w-full">
    <Suspense fallback={<MapSkeleton />}>
      <MapView 
        geojson={transformedGeoJSON} 
        selectedBusinesses={selectedBusinesses} 
      />
    </Suspense>
  </div>
)}
```

### 5. Implement Split View

- Fix the split view layout and data sharing:

```tsx
{viewMode === 'split' && (
  <div className="flex flex-col lg:flex-row lg:gap-4">
    <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
      <Suspense fallback={<TableSkeleton />}>
        <TableView /* props */ />
      </Suspense>
    </div>
    {geojson && (
      <div className="w-full lg:w-1/2 h-[50vh] sm:h-[55vh] lg:h-auto lg:min-h-[70vh]">
        <Suspense fallback={<MapSkeleton />}>
          <MapView /* props */ />
        </Suspense>
      </div>
    )}
  </div>
)}
```

### 6. Analytics View Integration

- Ensure Analytics view works with the same data:

```tsx
{viewMode === 'analytics' && (
  <div className="w-full">
    <Suspense fallback={<AnalyticsCardSkeleton type="distribution" />}>
      <AnalyticsView />
    </Suspense>
  </div>
)}
```

## Integration with CompanyStore

The ViewSwitcher should integrate with the CompanyStore to maintain selection state:

```tsx
// Inside ViewSwitcher component
const selectedKeys = useCompanyStore((s) => s.selectedKeys);
const setSelectedKeys = useCompanyStore((s) => s.setSelectedKeys);
```

## Performance Optimizations

- Use memo for expensive calculations
- Implement proper lazy loading
- Add suspense boundaries with appropriate loading states
- Use the useCallback hook for functions passed as props
- Ensure proper key props in lists

## Testing Strategy

Test the ViewSwitcher:
- In all view modes: table, map, split, analytics
- With different screen sizes
- With and without data
- With different selection states
- With different filter combinations 
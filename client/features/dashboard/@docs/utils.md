# Dashboard Utilities

This document provides information about the utility functions used in the Dashboard feature.

## Geographical Utilities

### `transformCompanyGeoJSON`

Transforms company data into GeoJSON format for use with map visualization.

```typescript
import { transformCompanyGeoJSON } from '@/features/dashboard/utils/geo';

const geojson = transformCompanyGeoJSON(companies);
```

### `calculateDistance`

Calculates the distance between two geographic coordinates using the Haversine formula.

```typescript
import { calculateDistance } from '@/features/dashboard/utils/geo';

const distance = calculateDistance(
  { latitude: 60.1699, longitude: 24.9384 }, // Helsinki
  { latitude: 61.4978, longitude: 23.7610 }  // Tampere
); // Result in kilometers
```

### `requestBrowserLocation`

Requests the user's location from the browser's Geolocation API.

```typescript
import { requestBrowserLocation } from '@/features/dashboard/utils/geo';

const userLocation = await requestBrowserLocation();
// Returns { latitude: number, longitude: number } if successful
```

## Table Utilities

### `getVisibleColumns`

Filters columns based on visibility settings.

```typescript
import { getVisibleColumns } from '@/features/dashboard/utils/table';

const visibleColumns = getVisibleColumns(allColumns);
```

### `sortData`

Sorts data based on a sort descriptor.

```typescript
import { sortData } from '@/features/dashboard/utils/table';

const sortedData = sortData(data, sortDescriptor);
```

### `filterData`

Filters data based on filter criteria.

```typescript
import { filterData } from '@/features/dashboard/utils/table';

const filteredData = filterData(data, {
  searchTerm: 'Helsinki',
  industries: ['A', 'B'],
  distanceLimit: 10,
  userLocation: { latitude: 60.1699, longitude: 24.9384 },
});
```

## Number Utilities

### `clampValue`

Clamps a value between a minimum and maximum.

```typescript
import { clampValue } from '@/features/dashboard/utils/number';

const clampedValue = clampValue(value, 0, 100);
```

### `formatNumber`

Formats a number with specified options.

```typescript
import { formatNumber } from '@/features/dashboard/utils/number';

const formattedNumber = formatNumber(1234.56, {
  precision: 2,
  showThousandsSeparator: true,
});
// Result: "1,234.56"
```

## Error Handling Utilities

### `convertToDashboardError`

Converts any error to a standardized DashboardError.

```typescript
import { convertToDashboardError } from '@/features/dashboard/utils/errorHandling';

try {
  // Some operation that might throw
} catch (error) {
  const dashboardError = convertToDashboardError(error);
  // Handle standardized error
}
```

### `shouldRetry`

Determines if an operation should be retried based on the error.

```typescript
import { shouldRetry } from '@/features/dashboard/utils/errorHandling';

const retry = shouldRetry(error, attemptNumber);
```

### `calculateRetryDelay`

Calculates the delay before the next retry attempt using exponential backoff.

```typescript
import { calculateRetryDelay } from '@/features/dashboard/utils/errorHandling';

const delayMs = calculateRetryDelay(attemptNumber);
```

## Analytics Utilities

### `getIndustryName`

Gets the display name for an industry code.

```typescript
import { getIndustryName } from '@/features/dashboard/utils/analytics';

const name = getIndustryName('A', industryNameMap);
// Example result: "Agriculture, forestry and fishing"
```

### `getThemedIndustryColor`

Gets the theme-specific color for an industry.

```typescript
import { getThemedIndustryColor } from '@/features/dashboard/utils/analytics';

const color = getThemedIndustryColor(industry, theme, filters);
```

### `transformIndustriesByCity`

Transforms raw data into a format suitable for industry-by-city visualizations.

```typescript
import { transformIndustriesByCity } from '@/features/dashboard/utils/analytics';

const transformedData = transformIndustriesByCity(rawData);
```

## Lazy Loading Utilities

### `preloadComponents`

Preloads components to improve perceived performance.

```typescript
import { preloadComponents } from '@/features/dashboard/utils/lazyLoading';

preloadComponents([
  { path: 'analytics/AnalyticsView', componentName: 'AnalyticsView' },
  { path: 'map/MapView', componentName: 'MapView' },
]);
```

### `createLazyComponent`

Creates a lazily loaded component with a loading fallback.

```typescript
import { createLazyComponent } from '@/features/dashboard/utils/lazyLoading';

const LazyComponent = createLazyComponent({
  path: 'analytics/AnalyticsView',
  componentName: 'AnalyticsView',
});
```

## Best Practices

1. Keep utility functions focused on a single responsibility
2. Use TypeScript for better type safety and documentation
3. Test utility functions with unit tests
4. Use memoization for expensive operations
5. Include helpful error messages for debugging 
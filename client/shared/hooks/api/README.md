# Data Fetching Hooks

This directory contains centralized API hooks for data fetching throughout the application. We've standardized on React Query for data fetching, caching, and state management to ensure a consistent approach.

## Core Hooks

- `useReactQuery.ts` - Base React Query wrapper hooks
- `useData.ts` - Hooks for general data (cities, companies)
- `useAnalytics.ts` - Hooks for analytics-specific data
- `useCitySelect.ts` - Hook for city selection with search

## Usage Guidelines

### Basic Usage

```tsx
import { useCities } from '@/shared/hooks/api/useData';

function MyCityComponent() {
  const { data: cities, isLoading, error } = useCities();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {cities.map(city => (
        <li key={city}>{city}</li>
      ))}
    </ul>
  );
}
```

### Feature Flag Integration

These hooks integrate with our feature flag system to allow for gradual rollout:

```tsx
import { USE_NEW_DATA_HOOKS } from '@/shared/config/features';
import { useCities } from '@/shared/hooks/api/useData';
import useSWR from 'swr';

function MyCityComponent() {
  // Use new hooks if feature flag is enabled
  const { data: citiesFromHook = [], isLoading: hookLoading } = 
    USE_NEW_DATA_HOOKS ? useCities() : { data: [], isLoading: false };
    
  // Fallback to SWR if feature flag is disabled
  const { data: citiesFromSWR = [], isLoading: swrLoading } = 
    !USE_NEW_DATA_HOOKS ? useSWR('/api/cities', fetcher) : { data: [], isLoading: false };
    
  const cities = USE_NEW_DATA_HOOKS ? citiesFromHook : citiesFromSWR;
  const isLoading = USE_NEW_DATA_HOOKS ? hookLoading : swrLoading;
  
  // Use cities and isLoading as before
}
```

### Enhanced Components

We also provide enhanced versions of components that use our data hooks:

```tsx
import { CitySearch } from '@/features/dashboard/components/common/CitySearch';

// CitySearch will automatically use the React Query implementation
// if the USE_NEW_DATA_HOOKS feature flag is enabled
function MyComponent() {
  return (
    <CitySearch 
      onCityChange={handleCityChange}
      selectedCity={selectedCity}
    />
  );
}
```

## Migration Strategy

When migrating existing components to use these hooks:

1. Create a new enhanced component using the hooks
2. Update the exports in `index.ts` to conditionally export based on feature flags
3. Update component usage to use the conditional export
4. Test thoroughly with the feature flag both enabled and disabled

This approach allows for safe, incremental adoption with easy rollback if needed. 
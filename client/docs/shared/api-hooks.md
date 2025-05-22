# API Data Fetching Hooks

This document provides an overview of the centralized API hook system used throughout the application for data fetching, caching, and state management.

## Overview

We use React Query as our standard approach for data fetching to provide consistent caching, background updates, and loading states across the application. All API-related hooks are organized under the `client/shared/hooks/api` directory.

## Core Hook Types

| Hook Type | Purpose | Example |
|-----------|---------|---------|
| Base Hooks | Foundation for data fetching | `useApiQuery`, `useApiGet` |
| Data Hooks | Domain-specific data retrieval | `useCities`, `useCompanies` |
| Analytics Hooks | Analytics-specific data | `useIndustryDistribution`, `useTopCities` |
| Prefetching | Optimize initial load times | `usePrefetchData` |

## Basic Usage

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

## Enhanced Components

We also provide enhanced components that use our data hooks internally:

```tsx
import { CitySearch } from '@/features/dashboard/components/common/CitySearch';

function MyComponent() {
  return (
    <CitySearch 
      onCityChange={handleCityChange}
      selectedCity={selectedCity}
    />
  );
}
```

## Hook Implementation Details

### Base Hooks

- `useReactQuery.ts` - Provides `useApiQuery`, `useApiGet`, and other base hooks that build on React Query
- `usePrefetchData.ts` - Helps prefetch critical data for better user experience

### Domain Hooks

- `useData.ts` - Hooks for fetching cities, companies, and company properties
- `useAnalytics.ts` - Hooks for analytics data (industry distribution, city comparison, etc.)
- `useCitySelect.ts` - Specialized hook for city selection with search functionality

## Error Handling

All hooks include standardized error handling that categorizes errors into types:
- Network errors
- Server errors
- Validation errors
- Not found errors

## Caching Strategy

React Query provides intelligent caching with configurable stale times:
- Cities data: 5 minutes stale time
- Company data: 1 minute stale time 
- Analytics data: 5-10 minutes stale time

## Implementation Location

For the actual implementation, refer to:
- `client/shared/hooks/api/useReactQuery.ts`
- `client/shared/hooks/api/useData.ts`
- `client/shared/hooks/api/useAnalytics.ts`
- `client/shared/hooks/api/useCitySelect.ts` 
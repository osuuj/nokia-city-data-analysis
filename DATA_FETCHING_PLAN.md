# Data Fetching Architecture Plan

## 1. Core Architecture

- **Standardize on React Query** for all data fetching
- Create centralized API config with environment detection
- Replace SWR usage with React Query
- Implement background prefetching strategy

## 2. Folder Structure

```
/shared/hooks/api/
  ├── useApi.ts         // Base API configuration 
  ├── useData.ts        // Core data hooks (cities, companies)
  └── useAnalytics.ts   // Analytics-specific hooks
```

## 3. Implementation Tasks

### Core API Layer

- Create centralized API configuration using existing `api.ts` as foundation
- Implement React Query's `useQuery` wrapper with sensible defaults
- Ensure proper error handling and retry logic

### Data Hooks

- Implement `useCities()` hook for city data
- Implement `useCompanies(city)` hook for GeoJSON company data
- Create specialized analytics hooks for multi-city data

### UI Components

- Create/update `CitySearch` component using the data hooks
- Create/update `MultiCitySearch` component for analytics view
- Implement background prefetching on landing page

### Data Management

- Implement `DataManager` component with React Query
- Create city selection context for state management
- Remove data fetching from Header component

## 4. Migration Strategy

- Begin with core API layer implementation
- Migrate one view at a time (Dashboard → Analytics → Others)
- Test thoroughly after each migration
- Maintain backward compatibility during transition

## 5. Key Technical Decisions

- Cache cities data for 5 minutes (staleTime: 5 * 60 * 1000)
- Cache companies data for 1 minute (staleTime: 60 * 1000)
- Prefetch cities data on landing page with 1-second delay
- Filter city lists client-side after data is fetched
- Use React Query's built-in loading/error states

## 6. Expected Outcomes

- Consistent data loading experience across application
- Reduced network requests through efficient caching
- Improved performance through background prefetching
- Better error handling and retry mechanisms
- Simplified component code by abstracting data fetching logic 
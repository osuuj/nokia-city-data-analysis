# Dashboard Hooks

This document provides information about the custom React hooks used in the Dashboard feature to manage data fetching, state, and side effects.

## Core Hooks

### useDashboard

The primary hook for managing dashboard state and actions.

```tsx
const { state, actions, error, isLoading, activeView } = useDashboard();
```

**Returns:**
- `state` - The current dashboard state
- `actions` - Actions to update dashboard state
- `error` - Any errors from dashboard operations
- `isLoading` - Loading state
- `activeView` - Currently active dashboard view

### useErrorRecovery

Hook for handling error recovery in dashboard components.

```tsx
const { isRecovering, recoverySuccessful, recoveryError, attemptRecovery, resetRecovery } = 
  useErrorRecovery({
    onRecoverySuccess: () => console.log('Recovery successful'),
    onRecoveryFailure: (error) => console.error('Recovery failed', error),
    context: 'DashboardComponent',
  });
```

## Data Hooks

### useFilteredBusinesses

Hook for filtering business data based on search queries and industries.

```tsx
const { filteredBusinesses, loading, debouncedSearch } = useFilteredBusinesses({
  data: businesses,
  industries: selectedIndustries,
  searchQuery: searchTerm,
});
```

### useTablePagination

Hook for managing table pagination.

```tsx
const { currentPage, totalPages, onPageChange, pageSize, onPageSizeChange } = useTablePagination({
  data: filteredData,
  defaultPageSize: 10,
});
```

### useTableSort

Hook for managing table sorting.

```tsx
const { sortDescriptor, setSortDescriptor, sortedData } = useTableSort({
  data: filteredData,
  defaultColumn: 'company_name',
  defaultDirection: 'ascending',
});
```

### useSearchFilter

Hook for managing search filtering with debouncing.

```tsx
const { searchTerm, setSearchTerm, debouncedTerm } = useSearchFilter({
  initialTerm: '',
  debounceMs: 300,
});
```

## Analytics Hooks

### useTopCities

Hook for fetching top cities data.

```tsx
const { data, isLoading, error } = useTopCities(10); // Fetch top 10 cities
```

### useIndustryDistribution

Hook for fetching industry distribution data for selected cities.

```tsx
const { data, isLoading, error } = useIndustryDistribution(selectedCities);
```

### useIndustriesByCity

Hook for fetching industries by city data.

```tsx
const { data, isLoading, error } = useIndustriesByCity(selectedCities);
```

### useCityComparison

Hook for fetching city comparison data.

```tsx
const { data, isLoading, error } = useCityComparison(selectedCities);
```

### useChartTheme

Hook for managing chart themes based on the app's theme.

```tsx
const { colors, fontFamily, fontSize } = useChartTheme();
```

## Store Hooks

### useCompanyStore

Hook for accessing the company store (Zustand).

```tsx
const selectedCity = useCompanyStore((state) => state.selectedCity);
const setSelectedCity = useCompanyStore((state) => state.setSelectedCity);
```

### useSelectionStore

Hook for managing row selection in tables.

```tsx
const selectedRows = useSelectionStore((state) => state.selectedRows);
const toggleRow = useSelectionStore((state) => state.toggleRow);
```

## Performance Hooks

### usePrefetch

Hook for prefetching data to improve perceived performance.

```tsx
usePrefetch({
  cities: ['Helsinki', 'Tampere'],
  industries: ['A', 'B', 'C'],
});
```

### useOptimizedQuery

Hook for optimized data fetching with caching and error handling.

```tsx
const { data, isLoading, error, refetch } = useOptimizedQuery(
  'companies',
  API_ENDPOINTS.COMPANIES,
  { city: selectedCity },
  { staleTime: 5 * 60 * 1000 }, // 5 minutes
);
```

## Best Practices

1. Prefer custom hooks over direct API calls within components
2. Use debouncing for search inputs to reduce unnecessary API calls
3. Implement error handling within hooks to centralize error management
4. Keep hook logic focused on a single responsibility
5. Use memoization to optimize hook performance 
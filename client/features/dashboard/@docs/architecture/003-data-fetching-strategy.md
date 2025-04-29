# ADR 003: Data Fetching Strategy

## Status

Accepted

## Context

The application was using a mix of direct fetch calls, axios, and custom hooks for data fetching. This led to inconsistent error handling, caching, and loading states. Additionally, the application was experiencing performance issues due to unnecessary re-renders and redundant API calls.

## Decision

We will implement a comprehensive data fetching strategy using React Query that includes:

1. **Centralized API Client**: A standardized API client for all HTTP requests.
2. **Enhanced Query Hooks**: Custom hooks that wrap React Query to provide consistent loading states, error handling, and caching.
3. **Optimistic Updates**: Optimistic UI updates for better user experience.
4. **Prefetching**: Prefetching data to improve perceived performance.

## Consequences

### Positive

- **Improved Performance**: Reduced unnecessary API calls and re-renders.
- **Better User Experience**: Consistent loading states and optimistic updates.
- **Easier Maintenance**: Centralized data fetching logic.
- **Better Error Handling**: Consistent error handling across all API requests.

### Negative

- **Learning Curve**: Developers need to learn React Query and the enhanced query hooks.
- **Increased Bundle Size**: React Query adds to the bundle size.
- **Complexity**: The data fetching logic is more complex than direct fetch calls.

## Implementation

### API Client

We will create a standardized API client:

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    return Promise.reject(error);
  }
);
```

### Enhanced Query Hooks

We will create enhanced query hooks for each API endpoint:

```typescript
function useTopCitiesEnhanced(enabled = true) {
  return useQuery(
    ['topCities'],
    () => apiClient.get('/api/analytics/top-cities').then((res) => res.data),
    {
      enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );
}
```

### Query Key Factory

We will create a query key factory to ensure consistent query keys:

```typescript
const queryKeys = {
  topCities: () => ['topCities'],
  industryDistribution: (cities: string[], industries: string[]) => [
    'industryDistribution',
    cities,
    industries,
  ],
  // Other query keys
};
```

## Alternatives Considered

### SWR

SWR was considered but rejected in favor of React Query due to its more comprehensive feature set and better TypeScript support.

### Redux with Redux Toolkit Query

Redux with Redux Toolkit Query was considered but rejected due to the added complexity of managing a global store.

### Direct Fetch Calls

Using direct fetch calls was considered but rejected due to the lack of caching, loading states, and error handling. 
# Shared Hooks

This directory contains reusable React hooks used across the application.

## Directory Structure

```
hooks/
├── api/          # API-related hooks
│   ├── useApi.ts
│   └── index.ts
├── data/         # Data management hooks
│   ├── useEnhancedQuery.ts
│   └── index.ts
└── index.ts      # Main export file
```

## Available Hooks

### API Hooks

- `useApiQuery` - Base query hook with error handling and type safety
- `useApiMutation` - Base mutation hook for POST requests
- `useApiPutMutation` - Base mutation hook for PUT requests
- `useApiDeleteMutation` - Base mutation hook for DELETE requests
- `useApiPatchMutation` - Base mutation hook for PATCH requests

### Data Hooks

- `useEnhancedQuery` - Enhanced query hook with improved caching and error handling
- `prefetchQuery` - Utility to prefetch data for a query
- `invalidateQuery` - Utility to invalidate and refetch a query

### Utility Hooks

- `useDebounce` - Hook for debouncing values
- `useMemoizedCallback` - Hook for memoizing callbacks
- `usePagination` - Hook for managing pagination state

## Usage Examples

### Using API Hooks

```typescript
import { useApiQuery, useApiMutation } from '@shared/hooks';

// Query example
const { data, isLoading } = useApiQuery('users', '/api/users');

// Mutation example
const { mutate } = useApiMutation('/api/users');
```

### Using Data Hooks

```typescript
import { useEnhancedQuery } from '@shared/hooks';

// Enhanced query with caching
const { data, isLoading } = useEnhancedQuery('users', '/api/users', {
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

## Best Practices

1. **Type Safety**
   - Always provide proper TypeScript types for your data
   - Use generics to ensure type safety across hooks

2. **Error Handling**
   - Use the built-in error handling capabilities
   - Implement proper error boundaries in your components

3. **Caching**
   - Use appropriate stale times for your data
   - Implement proper cache invalidation strategies

4. **Performance**
   - Use `useMemoizedCallback` for callbacks passed to child components
   - Implement proper loading states to prevent UI jumps

## Contributing

When adding new hooks:
1. Place them in the appropriate subdirectory
2. Update the index.ts file to export the new hook
3. Add proper TypeScript types
4. Include JSDoc documentation
5. Add usage examples to this README 
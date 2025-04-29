# Project Feature State Management

This document details the state management approach used in the project feature.

## Table of Contents
- [Overview](#overview)
- [Data Fetching](#data-fetching)
- [State Management](#state-management)
- [Caching](#caching)
- [Error Handling](#error-handling)

## Overview

The project feature uses a combination of React Query for server state management and React's built-in state management for UI state. This approach provides:

- Efficient data fetching and caching
- Automatic background updates
- Optimistic updates
- Error handling
- Loading states

## Data Fetching

### Project API Client

The `projectApi` client handles all API interactions:

```typescript
class ProjectApiClient {
  async fetchProjects(): Promise<Project[]> {
    // Implementation
  }

  async fetchProjectById(id: string): Promise<Project> {
    // Implementation
  }
}
```

### Data Hooks

Custom hooks for data fetching:

```typescript
// Fetch all projects
function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => projectApi.fetchProjects(),
  });
}

// Fetch single project
function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['project', id],
    queryFn: () => projectApi.fetchProjectById(id),
    enabled: !!id,
  });
}
```

## State Management

### Feature Hook

The `useProjectFeature` hook combines data fetching with UI state:

```typescript
function useProjectFeature(options: UseProjectFeatureOptions = {}) {
  // Data fetching
  const { data: projects = [], isLoading, isError, error } = useProjects();
  const { data: currentProject = null } = useProject(selectedProjectId || '');

  // UI state
  const [category, setCategory] = useState<ProjectCategory | null>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Derived state
  const filteredProjects = useMemo(() => {
    // Filtering logic
  }, [projects, category, searchTerm]);

  return {
    // Data
    projects,
    currentProject,
    isLoading,
    isError,
    error,

    // UI state
    category,
    searchTerm,
    filteredProjects,

    // Actions
    setCategory,
    setSearchTerm,
    selectProject,
    clearFilters,
  };
}
```

## Caching

### React Query Configuration

The project feature uses React Query for efficient caching:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Cache Invalidation

Cache invalidation is handled through React Query's mutation APIs:

```typescript
const mutation = useMutation({
  mutationFn: updateProject,
  onSuccess: () => {
    queryClient.invalidateQueries(['projects']);
  },
});
```

## Error Handling

### Error Boundaries

The `ProjectErrorBoundary` component catches and handles runtime errors:

```typescript
class ProjectErrorBoundary extends React.Component {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### API Error Handling

The API client includes comprehensive error handling:

```typescript
async fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.projects}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return validateProjects(data);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}
```

## Best Practices

1. **Data Fetching**
   - Use React Query for server state
   - Implement proper loading states
   - Handle errors gracefully
   - Cache responses appropriately

2. **State Management**
   - Keep UI state local to components
   - Use context for shared state
   - Implement proper loading states
   - Handle errors gracefully

3. **Performance**
   - Implement proper caching
   - Use memoization for expensive computations
   - Implement proper loading states
   - Handle errors gracefully

4. **Error Handling**
   - Use error boundaries
   - Implement proper error states
   - Log errors appropriately
   - Provide user feedback 
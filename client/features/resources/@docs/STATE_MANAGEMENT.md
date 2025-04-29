# Resources Feature State Management

This document details the state management approach used in the resources feature.

## Table of Contents
- [Overview](#overview)
- [Data Structure](#data-structure)
- [Data Fetching](#data-fetching)
- [Caching](#caching)
- [Virtualization](#virtualization)

## Overview

The resources feature uses a combination of:
- Static data for resource content
- React Query for data fetching and caching
- Custom hooks for data access and manipulation
- Virtualization for performance optimization

## Data Structure

The resources data is organized in a hierarchical structure:

```typescript
interface ResourceData {
  categories: ResourceCategoryData[];
}

interface ResourceCategoryData {
  id: ResourceCategory;
  title: string;
  description: string;
  icon: string;
  resources: Resource[];
}

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: ResourceType;
  category: ResourceCategory;
  link: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}
```

## Data Fetching

### Resource Hooks

The feature provides several hooks for accessing resource data:

```typescript
// Fetch all resource categories
function useResourceCategories() {
  return useQuery({
    queryKey: resourceKeys.categories(),
    queryFn: () => resourcesData.categories,
    ...CACHE_TIMES.STATIC,
  });
}

// Fetch a specific resource category
function useResourceCategory(categoryId: ResourceCategory) {
  return useQuery({
    queryKey: resourceKeys.category(categoryId),
    queryFn: () => {
      const category = resourcesData.categories.find((c) => c.id === categoryId);
      if (!category) {
        throw new Error(`Resource category with id ${categoryId} not found`);
      }
      return category;
    },
    ...CACHE_TIMES.STATIC,
  });
}

// Fetch a specific resource
function useResource(resourceId: string) {
  return useQuery({
    queryKey: resourceKeys.resource(resourceId),
    queryFn: () => {
      // Find the resource in any category
      for (const category of resourcesData.categories) {
        const resource = category.resources.find((r) => r.id === resourceId);
        if (resource) {
          return resource;
        }
      }
      throw new Error(`Resource with id ${resourceId} not found`);
    },
    ...CACHE_TIMES.STATIC,
  });
}
```

### Helper Functions

The feature also provides helper functions for common data operations:

```typescript
// Get all resources
function getAllResources(): Resource[] {
  return resourcesData.categories.flatMap((category) => category.resources);
}

// Get resources by category
function getResourcesByCategory(categoryId: ResourceCategory): Resource[] {
  const category = resourcesData.categories.find((c) => c.id === categoryId);
  return category ? category.resources : [];
}

// Get resources by tag
function getResourcesByTag(tag: string): Resource[] {
  return getAllResources().filter((resource) => resource.tags?.includes(tag));
}
```

## Caching

The feature uses React Query for efficient caching:

```typescript
// Query keys for better cache management
export const resourceKeys = {
  all: ['resources'] as const,
  categories: () => [...resourceKeys.all, 'categories'] as const,
  category: (id: ResourceCategory) => [...resourceKeys.categories(), id] as const,
  resource: (id: string) => [...resourceKeys.all, 'resource', id] as const,
};
```

Cache settings are imported from the project feature:

```typescript
import { CACHE_OPTIMIZATION, CACHE_RULES, CACHE_TIMES } from '@/features/project/config/cache';
```

## Virtualization

For performance optimization with large resource lists, the feature provides a virtualization hook:

```typescript
function useVirtualizedResources({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualizedResourcesOptions) {
  // Implementation details...
  
  return {
    virtualItems,
    totalHeight,
    scrollContainerProps,
    scrollToItem,
  };
}
```

This hook:
- Calculates which items should be visible based on scroll position
- Provides scroll handling functions
- Optimizes rendering by only rendering visible items
- Supports scrolling to specific items

## Best Practices

1. **Data Access**
   - Use the provided hooks for data access
   - Leverage React Query's caching capabilities
   - Handle loading and error states properly

2. **Performance**
   - Use virtualization for large lists
   - Implement proper loading states
   - Optimize rendering with memoization

3. **Error Handling**
   - Use error boundaries for component errors
   - Handle API errors gracefully
   - Provide fallback UI for error states 
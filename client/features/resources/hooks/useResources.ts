import { CACHE_OPTIMIZATION, CACHE_RULES, CACHE_TIMES } from '@/features/project/config/cache';
import { useQuery } from '@tanstack/react-query';
import { resourcesData } from '../data/resources';
import type { Resource, ResourceCategory, ResourceCategoryData } from '../types';

// Define query keys for better cache management
export const resourceKeys = {
  all: ['resources'] as const,
  categories: () => [...resourceKeys.all, 'categories'] as const,
  categoryList: () => [...resourceKeys.categories(), 'list'] as const,
  category: (id: ResourceCategory) => [...resourceKeys.categories(), id] as const,
  resource: (id: string) => [...resourceKeys.all, 'resource', id] as const,
  resourcesByCategory: (categoryId: ResourceCategory) =>
    [...resourceKeys.all, 'byCategory', categoryId] as const,
};

/**
 * Hook to fetch just the category metadata (without resources)
 * This provides faster initial loading
 */
export function useCategoryList() {
  return useQuery({
    queryKey: resourceKeys.categoryList(),
    queryFn: () => {
      // Return only category metadata without resources for faster loading
      return resourcesData.categories.map(({ id, title, description, icon }) => ({
        id,
        title,
        description,
        icon,
      }));
    },
    ...CACHE_TIMES.STATIC,
    ...CACHE_RULES,
    retry: CACHE_OPTIMIZATION.retry.count,
    retryDelay: CACHE_OPTIMIZATION.retry.delay,
  });
}

/**
 * Hook to fetch all resource categories
 */
export function useResourceCategories() {
  return useQuery({
    queryKey: resourceKeys.categories(),
    queryFn: () => resourcesData.categories,
    ...CACHE_TIMES.STATIC, // Use static cache settings for resource categories
    ...CACHE_RULES,
    retry: CACHE_OPTIMIZATION.retry.count,
    retryDelay: CACHE_OPTIMIZATION.retry.delay,
    refetchOnWindowFocus: CACHE_OPTIMIZATION.backgroundRefetch.enabled,
    refetchInterval: CACHE_OPTIMIZATION.backgroundRefetch.interval,
    // Adding select function to filter out unnecessary data from the network response
    // and ensuring resources include the category property
    select: (data) => {
      // Return only the necessary fields to reduce payload size and ensure proper typing
      return data.map((category) => ({
        ...category,
        resources: category.resources.map((resource) => ({
          ...resource,
          // Ensure each resource has the category property
          category: resource.category || category.id,
        })),
      })) as ResourceCategoryData[];
    },
  });
}

/**
 * Hook to fetch a specific resource category with lazy loading
 */
export function useResourceCategory(categoryId: ResourceCategory) {
  return useQuery({
    queryKey: resourceKeys.category(categoryId),
    queryFn: () => {
      const category = resourcesData.categories.find((c) => c.id === categoryId);
      if (!category) {
        throw new Error(`Resource category with id ${categoryId} not found`);
      }
      return category;
    },
    ...CACHE_TIMES.STATIC, // Use static cache settings for resource category
    ...CACHE_RULES,
    retry: CACHE_OPTIMIZATION.retry.count,
    retryDelay: CACHE_OPTIMIZATION.retry.delay,
    // Only fetch when needed - implement lazy loading
    enabled: !!categoryId,
  });
}

/**
 * Hook to fetch resources for a specific category with pagination
 */
export function useResourcesByCategory(categoryId: ResourceCategory, limit = 10) {
  return useQuery({
    queryKey: resourceKeys.resourcesByCategory(categoryId),
    queryFn: () => {
      const resources = getResourcesByCategory(categoryId);
      // Return limited number of resources for faster initial load
      return resources.slice(0, limit);
    },
    ...CACHE_TIMES.STATIC,
    ...CACHE_RULES,
    // Only fetch when needed - implement lazy loading
    enabled: !!categoryId,
  });
}

/**
 * Hook to fetch a specific resource
 */
export function useResource(resourceId: string) {
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
    ...CACHE_TIMES.STATIC, // Use static cache settings for resource
    ...CACHE_RULES,
    retry: CACHE_OPTIMIZATION.retry.count,
    retryDelay: CACHE_OPTIMIZATION.retry.delay,
    // Only fetch when needed - implement lazy loading
    enabled: !!resourceId,
  });
}

/**
 * Helper function to get all resources
 */
export function getAllResources(): Resource[] {
  return resourcesData.categories.flatMap((category) => category.resources);
}

/**
 * Helper function to get resources by category
 */
export function getResourcesByCategory(categoryId: ResourceCategory): Resource[] {
  const category = resourcesData.categories.find((c) => c.id === categoryId);
  return category ? category.resources : [];
}

/**
 * Helper function to get resources by tag
 */
export function getResourcesByTag(tag: string): Resource[] {
  return getAllResources().filter((resource) => resource.tags?.includes(tag));
}

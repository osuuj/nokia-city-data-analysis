import { CACHE_OPTIMIZATION, CACHE_RULES, CACHE_TIMES } from '@/features/project/config/cache';
import { useQuery } from '@tanstack/react-query';
import { resourcesData } from '../data/resources';
import { type Resource, type ResourceCategory, ResourceCategoryData } from '../types';

// Define query keys for better cache management
export const resourceKeys = {
  all: ['resources'] as const,
  categories: () => [...resourceKeys.all, 'categories'] as const,
  category: (id: ResourceCategory) => [...resourceKeys.categories(), id] as const,
  resource: (id: string) => [...resourceKeys.all, 'resource', id] as const,
};

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
  });
}

/**
 * Hook to fetch a specific resource category
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
    refetchOnWindowFocus: CACHE_OPTIMIZATION.backgroundRefetch.enabled,
    refetchInterval: CACHE_OPTIMIZATION.backgroundRefetch.interval,
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
    refetchOnWindowFocus: CACHE_OPTIMIZATION.backgroundRefetch.enabled,
    refetchInterval: CACHE_OPTIMIZATION.backgroundRefetch.interval,
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

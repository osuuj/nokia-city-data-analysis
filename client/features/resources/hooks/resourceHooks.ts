/**
 * Resource Hooks
 *
 * This file provides hooks and helper functions for accessing and managing resource data.
 * It centralizes all resource data access logic in one place for better maintainability.
 */

export {
  getAllResources,
  getResourcesByCategory,
  getResourcesByTag,
  resourceKeys,
  useResource,
  useResourceCategories,
  useResourceCategory,
} from './useResources';

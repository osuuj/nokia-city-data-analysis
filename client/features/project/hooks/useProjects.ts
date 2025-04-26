import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CACHE_OPTIMIZATION,
  CACHE_RULES,
  CACHE_TIMES,
  invalidateProjectCache,
  prefetchProject,
} from '../config/cache';
import { projectsData } from '../data/sampleProjects';
import type { Project } from '../types';

/**
 * Query keys for project data caching
 *
 * These keys are used to manage the React Query cache for project data.
 * They follow a hierarchical structure to support different query types.
 */
export const projectKeys = {
  /** Base key for all project queries */
  all: ['projects'] as const,
  /** Key for project list queries */
  lists: () => [...projectKeys.all, 'list'] as const,
  /** Key for filtered project list queries */
  list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
  /** Key for project detail queries */
  details: () => [...projectKeys.all, 'detail'] as const,
  /** Key for specific project detail queries */
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

/**
 * Retrieves all projects from the data source
 * @returns Array of Project objects
 */
const getProjects = (): Project[] => {
  return projectsData;
};

/**
 * Retrieves a specific project by ID
 * @param id - The project ID to look up
 * @returns The Project object if found, undefined otherwise
 */
const getProjectById = (id: string): Project | undefined => {
  return projectsData.find((p) => p.id === id);
};

/**
 * Hook to fetch and cache all projects
 *
 * @returns Query result containing the projects array and loading/error states
 *
 * @example
 * ```tsx
 * const { data: projects, isLoading } = useProjects();
 * ```
 */
export function useProjects() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => getProjects(),
    ...CACHE_TIMES.STATIC, // Use static cache settings for project list
    ...CACHE_RULES,
    retry: CACHE_OPTIMIZATION.retry.count,
    retryDelay: CACHE_OPTIMIZATION.retry.delay,
    refetchOnWindowFocus: CACHE_OPTIMIZATION.backgroundRefetch.enabled,
    refetchInterval: CACHE_OPTIMIZATION.backgroundRefetch.interval,
  });
}

/**
 * Hook to fetch and cache a specific project
 *
 * @param id - The ID of the project to fetch
 * @returns Query result containing the project and loading/error states
 *
 * @example
 * ```tsx
 * const { data: project, isLoading } = useProject('project-id');
 * ```
 */
export function useProject(id: string) {
  const queryClient = useQueryClient();
  const initialData = projectsData.find((p) => p.id === id);

  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => {
      const project = getProjectById(id);
      if (!project) {
        throw new Error(`Project with id ${id} not found`);
      }
      return project;
    },
    initialData,
    ...CACHE_TIMES.STATIC, // Use static cache settings for project details
    ...CACHE_RULES,
    retry: CACHE_OPTIMIZATION.retry.count,
    retryDelay: CACHE_OPTIMIZATION.retry.delay,
    refetchOnWindowFocus: CACHE_OPTIMIZATION.backgroundRefetch.enabled,
    refetchInterval: CACHE_OPTIMIZATION.backgroundRefetch.interval,
  });
}

/**
 * Hook to prefetch project data
 *
 * @returns Function to prefetch a project by ID
 *
 * @example
 * ```tsx
 * const prefetch = usePrefetchProject();
 * // Prefetch on hover
 * <div onMouseEnter={() => prefetch('project-id')}>
 *   Project Card
 * </div>
 * ```
 */
export function usePrefetchProject() {
  const queryClient = useQueryClient();
  return (projectId: string) => prefetchProject(queryClient, projectId);
}

/**
 * Hook to invalidate project cache
 *
 * @returns Function to invalidate project cache by ID or all projects
 *
 * @example
 * ```tsx
 * const invalidate = useInvalidateProjectCache();
 * // Invalidate specific project
 * invalidate('project-id');
 * // Invalidate all projects
 * invalidate();
 * ```
 */
export function useInvalidateProjectCache() {
  const queryClient = useQueryClient();
  return (projectId?: string) => invalidateProjectCache(queryClient, projectId);
}

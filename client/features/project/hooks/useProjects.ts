import { useQuery } from '@tanstack/react-query';
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
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => getProjects(),
    staleTime: Number.POSITIVE_INFINITY, // Static data doesn't get stale
    gcTime: Number.POSITIVE_INFINITY, // Don't garbage collect this data
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
  // Return empty result for empty id to prevent unnecessary queries
  if (!id) return { data: undefined, isLoading: false, isError: false, error: null };

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
    staleTime: Number.POSITIVE_INFINITY, // Static data doesn't get stale
    gcTime: Number.POSITIVE_INFINITY, // Don't garbage collect this data
    enabled: !!id, // Only run query if id is provided
  });
}

// Prefetch and invalidate functions are removed as they're not needed
// with the simplified caching approach for static data

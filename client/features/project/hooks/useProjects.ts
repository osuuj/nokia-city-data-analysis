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

// Define query keys for better cache management
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// Static data functions
const getProjects = (): Project[] => {
  return projectsData;
};

const getProjectById = (id: string): Project | undefined => {
  return projectsData.find((p) => p.id === id);
};

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

// Helper function to prefetch a project
export function usePrefetchProject() {
  const queryClient = useQueryClient();
  return (projectId: string) => prefetchProject(queryClient, projectId);
}

// Helper function to invalidate project cache
export function useInvalidateProjectCache() {
  const queryClient = useQueryClient();
  return (projectId?: string) => invalidateProjectCache(queryClient, projectId);
}

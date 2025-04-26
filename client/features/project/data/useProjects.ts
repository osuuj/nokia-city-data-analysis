/**
 * Projects Data Hooks
 *
 * This file contains hooks for fetching and managing projects data.
 */

import { useQuery } from '@tanstack/react-query';
import type { Project } from '../types';
import { projectApi } from './projectApi';

/**
 * Hook for fetching all projects
 *
 * @returns Query result containing projects data and loading/error states
 */
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => projectApi.fetchProjects(),
  });
}

/**
 * Hook for fetching a single project by ID
 *
 * @param id - The project ID to fetch
 * @returns Query result containing project data and loading/error states
 */
export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['project', id],
    queryFn: () => projectApi.fetchProjectById(id),
    enabled: !!id,
  });
}

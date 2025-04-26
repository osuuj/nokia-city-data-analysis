/**
 * Project Feature Hook
 *
 * This hook provides a unified interface for the project feature.
 * It combines data fetching, state management, and UI interactions.
 */

import { useCallback, useMemo, useState } from 'react';
import { useProject, useProjects } from '../data';
import type { Project, ProjectCategory } from '../types';

interface UseProjectFeatureOptions {
  initialCategory?: ProjectCategory | null;
  initialSearchTerm?: string;
}

interface UseProjectFeatureResult {
  // Data
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Filtering and search
  category: ProjectCategory | null;
  searchTerm: string;
  filteredProjects: Project[];

  // Actions
  setCategory: (category: ProjectCategory | null) => void;
  setSearchTerm: (term: string) => void;
  selectProject: (id: string) => void;
  clearFilters: () => void;
}

/**
 * Custom hook for the project feature
 *
 * @param options - Configuration options for the hook
 * @returns Project feature state and actions
 *
 * @example
 * ```tsx
 * const {
 *   projects,
 *   isLoading,
 *   category,
 *   setCategory,
 *   filteredProjects
 * } = useProjectFeature({
 *   initialCategory: ProjectCategory.Web
 * });
 * ```
 */
export function useProjectFeature(options: UseProjectFeatureOptions = {}): UseProjectFeatureResult {
  // Destructure options with defaults
  const { initialCategory = null, initialSearchTerm = '' } = options;

  // State
  const [category, setCategory] = useState<ProjectCategory | null>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Data fetching
  const { data: projects = [], isLoading, isError, error } = useProjects();

  // Fetch current project if selected
  const { data: currentProject = null } = useProject(selectedProjectId || '');

  // Filter projects based on category and search term
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by category
      if (category && project.category !== category) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          (project.tags?.some((tag) => tag.toLowerCase().includes(term)) ?? false)
        );
      }

      return true;
    });
  }, [projects, category, searchTerm]);

  // Actions
  const selectProject = useCallback((id: string) => {
    setSelectedProjectId(id);
  }, []);

  const clearFilters = useCallback(() => {
    setCategory(null);
    setSearchTerm('');
  }, []);

  return {
    // Data
    projects,
    currentProject,
    isLoading,
    isError,
    error,

    // Filtering and search
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

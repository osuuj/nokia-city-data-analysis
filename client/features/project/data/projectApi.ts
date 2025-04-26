/**
 * Project API Client
 *
 * This file contains the API client for the project feature.
 * It uses Zod for runtime validation of API responses.
 */

import { useQuery } from '@tanstack/react-query';
import type { Project, ProjectsData } from '../types';
import { validateProject, validateProjects } from '../types/schemas';

// API endpoints
const API_ENDPOINTS = {
  projects: '/api/projects',
  project: (id: string) => `/api/projects/${id}`,
};

// API client class
export class ProjectApiClient {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetches all projects from the API
   * @returns Promise<ProjectsData>
   */
  async fetchProjects(): Promise<ProjectsData> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.projects}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate the response data
      return validateProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  /**
   * Fetches a single project by ID
   * @param id - The project ID
   * @returns Promise<Project>
   */
  async fetchProjectById(id: string): Promise<Project> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.project(id)}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate the response data
      return validateProject(data);
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  }
}

// Create a singleton instance
export const projectApi = new ProjectApiClient();

// React Query hooks
export const useProjects = () => {
  return useQuery<ProjectsData, Error>({
    queryKey: ['projects'],
    queryFn: () => projectApi.fetchProjects(),
  });
};

export const useProject = (id: string) => {
  return useQuery<Project, Error>({
    queryKey: ['project', id],
    queryFn: () => projectApi.fetchProjectById(id),
    enabled: !!id,
  });
};

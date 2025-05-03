/**
 * Project Feature
 *
 * This file exports all components, hooks, and utilities for the project feature.
 *
 * Key exports:
 * - Components: ProjectCard, ProjectDetailClient, ProjectErrorBoundary, etc.
 * - Hooks: useProjects, useProject
 * - Types: Project, ProjectCategory, ProjectStatus, GalleryItem
 * - Config: Cache configuration for data fetching
 */

// Components
import {
  ProjectCard,
  ProjectDetailClient,
  ProjectDetailSkeleton,
  ProjectErrorBoundary,
  ProjectGridSkeleton,
} from './components';

// Hooks
import { useProject, useProjects } from './hooks';

// Types
import type { GalleryItem, Project } from './types';
import { ProjectCategory, ProjectStatus } from './types';

// Config
import { CACHE_OPTIMIZATION, CACHE_RULES, CACHE_TIMES } from './config';

// Named exports
export {
  // Components
  ProjectCard,
  ProjectDetailClient,
  ProjectErrorBoundary,
  ProjectGridSkeleton,
  ProjectDetailSkeleton,
  // Hooks
  useProjects,
  useProject,
  // Types
  type Project,
  ProjectCategory,
  ProjectStatus,
  type GalleryItem,
  // Config
  CACHE_TIMES,
  CACHE_OPTIMIZATION,
  CACHE_RULES,
};

// Module exports
export * from './components';
export * from './hooks';
export * from './types';
export * from './config';

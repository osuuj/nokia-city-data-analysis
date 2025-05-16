/**
 * Resources Types
 *
 * This file exports all types for the resources feature.
 */

/**
 * Resource types for the application
 */

/**
 * Resource category type
 */
export type ResourceCategory =
  | 'getting-started'
  | 'guides'
  | 'templates'
  | 'api'
  | 'faq'
  | 'community'
  | 'data-insights'
  | 'api-documentation';

/**
 * Resource type
 */
export type ResourceType =
  | 'Guide'
  | 'FAQ'
  | 'PDF'
  | 'Template'
  | 'API'
  | 'Video'
  | 'Link'
  | 'Documentation';

/**
 * Resource interface
 */
export interface Resource {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: ResourceType;
  category: ResourceCategory;
  link: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  isWorkInProgress?: boolean;
}

/**
 * Resource category interface
 */
export interface ResourceCategoryData {
  id: ResourceCategory;
  title: string;
  description: string;
  icon: string;
  resources: Resource[];
}

/**
 * Resource data interface
 */
export interface ResourceData {
  categories: ResourceCategoryData[];
}

// Add types here as they are created

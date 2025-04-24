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
  | 'community';

/**
 * Resource type
 */
export type ResourceType = 'Guide' | 'FAQ' | 'PDF' | 'Template' | 'API' | 'Video' | 'Link';

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

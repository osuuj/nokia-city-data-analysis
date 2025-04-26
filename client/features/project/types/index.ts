/**
 * Project Types
 *
 * This file exports all types for the project feature.
 */

export enum ProjectCategory {
  Web = 'web',
  AI = 'ai',
  Mobile = 'mobile',
  Desktop = 'desktop',
  Other = 'other',
}

export enum ProjectStatus {
  Active = 'active',
  Planning = 'planning',
  Completed = 'completed',
  OnHold = 'on_hold',
}

export type { ProjectsData } from './schemas';

/**
 * Represents a gallery item with image source, alt text, and optional caption
 */
export interface GalleryItem {
  /**
   * The source URL of the image
   */
  src: string;

  /**
   * The alt text for the image
   */
  alt: string;

  /**
   * Optional caption to display below the image
   */
  caption?: string;
}

/**
 * Represents a project in the application
 */
export interface Project {
  /**
   * Unique identifier for the project
   */
  id: string;

  /**
   * Title of the project
   */
  title: string;

  /**
   * Subtitle or tagline of the project
   */
  subtitle?: string;

  /**
   * Brief description of the project
   */
  description: string;

  /**
   * Detailed description of the project
   */
  longDescription?: string;

  /**
   * Main image URL for the project
   */
  image?: string;

  /**
   * Array of gallery items showcasing the project
   */
  gallery?: GalleryItem[];

  /**
   * Category of the project
   */
  category?: ProjectCategory;

  /**
   * Array of technology tags used in the project
   */
  tags?: string[];

  /**
   * Array of project goals
   */
  goals?: string[];

  /**
   * Timeline or duration of the project
   */
  timeline?:
    | string
    | {
        date: string;
        title: string;
        description: string;
      }[];

  /**
   * Role in the project
   */
  role?: string;

  /**
   * Team members involved in the project
   */
  team?: string[];

  /**
   * URL to the project demo
   */
  demoUrl?: string;

  /**
   * URL to the project repository
   */
  repoUrl?: string;

  /**
   * Whether the project is featured
   */
  featured?: boolean;

  /**
   * Current status of the project
   */
  status?: ProjectStatus;

  /**
   * Array of technologies used in the project
   */
  technologies?: string[];

  /**
   * URL to the project's repository
   */
  repositoryUrl?: string;

  /**
   * URL to the live project
   */
  liveUrl?: string;

  /**
   * Start date of the project
   */
  startDate?: string;

  /**
   * End date of the project (optional for ongoing projects)
   */
  endDate?: string;
}

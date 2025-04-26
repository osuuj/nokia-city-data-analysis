/**
 * Project Constants
 *
 * This file contains all constant values used throughout the project feature.
 * These constants are used for configuration, validation, and UI rendering.
 */

/**
 * Project display settings
 */
export const PROJECT_DISPLAY = {
  /**
   * Number of projects to display per page
   */
  ITEMS_PER_PAGE: 9,

  /**
   * Maximum number of tags to display in project cards
   */
  MAX_TAGS: 3,

  /**
   * Maximum length of project descriptions in cards
   */
  MAX_DESCRIPTION_LENGTH: 150,
} as const;

/**
 * Project validation settings
 */
export const PROJECT_VALIDATION = {
  /**
   * Minimum length for project titles
   */
  MIN_TITLE_LENGTH: 3,

  /**
   * Maximum length for project titles
   */
  MAX_TITLE_LENGTH: 100,

  /**
   * Minimum length for project descriptions
   */
  MIN_DESCRIPTION_LENGTH: 10,

  /**
   * Maximum length for project descriptions
   */
  MAX_DESCRIPTION_LENGTH: 1000,

  /**
   * Maximum number of tags per project
   */
  MAX_TAGS: 10,

  /**
   * Maximum number of gallery items per project
   */
  MAX_GALLERY_ITEMS: 10,
} as const;

/**
 * Project API settings
 */
export const PROJECT_API = {
  /**
   * Base URL for project API endpoints
   */
  BASE_URL: '/api/projects',

  /**
   * Default timeout for API requests in milliseconds
   */
  TIMEOUT: 5000,

  /**
   * Maximum number of retries for failed API requests
   */
  MAX_RETRIES: 3,
} as const;

/**
 * Project UI settings
 */
export const PROJECT_UI = {
  /**
   * Animation duration for project transitions in milliseconds
   */
  ANIMATION_DURATION: 300,

  /**
   * Delay between project card animations in milliseconds
   */
  ANIMATION_DELAY: 100,

  /**
   * Breakpoints for responsive grid layout
   */
  GRID_BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
} as const;

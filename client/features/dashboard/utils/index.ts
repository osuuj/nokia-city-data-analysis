/**
 * Export all utility functions
 */

// Error handling utilities
export { errorReporting } from './errorReporting';

// Lazy loading utilities
export * from './lazyLoading';

// Geo utilities
export * from './geo';

// Filter utilities
export * from './filters.utils';

// Table utilities - export everything except sortCompanies to avoid conflict
export {
  getVisibleColumns,
  applySearchFilter,
  applyIndustryFilter,
  getCellValue,
} from './table';

// Filter configurations
export { filters } from './filters';

// Generic logging function
export const logError = (error: Error, errorInfo: React.ErrorInfo, componentName?: string) => {
  console.error(`Error in ${componentName || 'unknown component'}:`, error, errorInfo);
};

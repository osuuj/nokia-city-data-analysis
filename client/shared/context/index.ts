/**
 * React Context providers and hooks for global state management
 * Export all context-related components and hooks from this file
 */

export { BreadcrumbProvider, useBreadcrumb } from './BreadcrumbContext';
export { LoadingProvider, useLoading } from './loading/LoadingContext';
export type { LoadingPriority, LoadingType } from './loading/LoadingContext';
export { ThemeProvider, useThemeContext } from './ThemeContext';

// Example: export { ThemeProvider, useTheme } from './ThemeContext';
// Example: export { AuthProvider, useAuth } from './AuthContext';

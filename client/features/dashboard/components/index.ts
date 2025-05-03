/**
 * Dashboard Components
 *
 * Centralizes exports from all dashboard components for easier imports.
 */

// Layout components are now exported through layout directory
export * from './layout';

// Views are exported through their own directory structure
export * from './views';

// Common components (including DashboardPage)
export * from './common';

// Controls
export * from './controls/ViewModeToggle';

// Since we've moved components to their proper locations,
// we should no longer export from these deprecated paths.
// The components are now available through the proper exports.

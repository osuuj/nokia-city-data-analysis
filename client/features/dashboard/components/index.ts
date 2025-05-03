/**
 * Dashboard Components
 *
 * Centralizes exports from all dashboard components for easier imports.
 */

// Main components
export * from './DashboardPage';
export * from './DashboardError';
export * from './DashboardFooter';
export * from './DashboardSidebar';
export * from './PrimaryDashboardHeader';

// Views are now exported through their own directory structure
export * from './views';

// Common components
export * from './common';

// Since we've moved the analytics components to the views structure,
// we should no longer export from these directories directly.
// The components are now available through the './views' export.

// Not exporting these to avoid duplicate exports with views
// export * from './layout/Sidebar';
// export * from './map';
// export * from './table';
// export * from './shared';

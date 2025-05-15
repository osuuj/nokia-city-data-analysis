/**
 * About Feature
 *
 * This is the main export file for the About feature.
 * It exports components, hooks, and types that should be accessible from outside the feature.
 */

// Export components
export * from './components/Team';
export * from './components/ui/TeamMemberCard';

// Export profile section components
export * from './components/sections/ProfileHero';
export * from './components/sections/ProfileSkills';
export * from './components/sections/ProfileExperience';
export * from './components/sections/ProfileProjects';
export * from './components/sections/ProfileTestimonials';
export * from './components/sections/ProfileContact';

// Export dynamic profile page components
export { default as DynamicProfilePage } from './pages/DynamicProfilePage';
export { ProfilePage } from './pages/ProfilePage';

// Export hooks for data access
export * from './hooks';

// Export data model and types
export * from './types/types';
export * from './data';

// Note: Store exports are commented out until they contain actual exports
// export * from './store';

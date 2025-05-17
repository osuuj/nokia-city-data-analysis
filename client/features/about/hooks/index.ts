/**
 * About Hooks
 *
 * This file exports all hooks for the about feature.
 * It serves as the main entry point for data fetching hooks and other custom hooks.
 */

// Export the hooks from the team member file
export { useTeamMember, teamKeys } from './useTeamMember';

// Use the standalone useTeamMembers from useTeamMember file
export { useTeamMembers } from './useTeamMember';

// Export profile data hook
export * from './useProfileData';

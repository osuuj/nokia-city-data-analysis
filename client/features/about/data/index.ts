/**
 * About Feature Data
 *
 * This file exports data used in the about feature.
 */

// Data exports for the About feature
// This index file collects and re-exports all data-related modules

// Profile data
export * from './kasperiData';
export * from './teamMembers';

// Import all profile data for the profileData map
import { juusoData } from './juusoData';
import { kasperiData } from './kasperiData';

// Map of all profile data by id
export const profileData = {
  juuso: juusoData,
  kasperi: kasperiData,
};

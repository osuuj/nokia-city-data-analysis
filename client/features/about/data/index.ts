/**
 * About Feature Data
 *
 * This file exports data used in the about feature.
 */

export * from './teamMembers';

// Export profile data
export * from './juusoData';
export * from './kassuData';

// Export a map of profile IDs to their data for easy lookup
import { juusoData } from './juusoData';
import { kassuData } from './kassuData';

export const profileDataMap = {
  juuso: juusoData,
  kassu: kassuData,
};

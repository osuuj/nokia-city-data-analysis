/**
 * Dashboard Service
 * Core functionality for the dashboard including data fetching and state management
 */

import type { ErrorWithApi } from '../hooks/analytics/types';
import { fetchWithErrorHandling } from './analyticsService';

// Constants
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

/**
 * Dashboard data interface
 */
export interface DashboardData {
  totalCompanies: number;
  totalCities: number;
  totalIndustries: number;
  recentUpdates: Array<{
    id: string;
    type: string;
    description: string;
    date: string;
  }>;
  // Add more dashboard data properties as needed
}

/**
 * Fetches dashboard summary data
 */
export async function fetchDashboardSummary() {
  return fetchWithErrorHandling<DashboardData>(`${BASE_URL}/api/v1/dashboard/summary`);
}

/**
 * Fetches user preferences if authenticated
 */
export async function fetchUserPreferences() {
  return fetchWithErrorHandling<{
    defaultCity: string;
    defaultView: string;
    favoriteIndustries: string[];
  }>(`${BASE_URL}/api/v1/user/preferences`);
}

/**
 * Saves user preferences
 */
export async function saveUserPreferences(preferences: {
  defaultCity?: string;
  defaultView?: string;
  favoriteIndustries?: string[];
}) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/user/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error(`Failed to save preferences: ${response.statusText}`);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving preferences:', error);
    return {
      success: false,
      error: {
        name: 'PreferencesError',
        message: error instanceof Error ? error.message : 'Unknown error saving preferences',
        status: 500,
      } as ErrorWithApi,
    };
  }
}

/**
 * Handles dashboard error reporting
 */
export function reportDashboardError(error: Error, context: string) {
  // In a real app, this would send to your error reporting service
  console.error(`[Dashboard Error] ${context}:`, error);

  // Example of how this might work with a service like Sentry
  // Sentry.captureException(error, { tags: { context } });

  return {
    reported: true,
    timestamp: new Date().toISOString(),
  };
}

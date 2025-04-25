'use client';

import { useLoading } from '@/shared/context/LoadingContext';
import { useCallback, useEffect, useState } from 'react';

export type DashboardLoadingSection = 'header' | 'map' | 'table' | 'filters' | 'stats' | 'all';

interface DashboardLoadingState {
  header: boolean;
  map: boolean;
  table: boolean;
  filters: boolean;
  stats: boolean;
}

/**
 * Custom hook for managing dashboard-specific loading states
 * Provides granular control over different sections of the dashboard
 */
export function useDashboardLoading() {
  const { startLoading, stopLoading, updateLoadingMessage } = useLoading();
  const [sectionStates, setSectionStates] = useState<DashboardLoadingState>({
    header: false,
    map: false,
    table: false,
    filters: false,
    stats: false,
  });

  // Track if any section is loading
  const isAnySectionLoading = Object.values(sectionStates).some(Boolean);

  // Start loading a specific section
  const startSectionLoading = useCallback(
    (section: DashboardLoadingSection, message?: string) => {
      if (section === 'all') {
        startLoading({
          type: 'skeleton',
          priority: 'high',
          message: message || 'Loading dashboard...',
        });
        setSectionStates({
          header: true,
          map: true,
          table: true,
          filters: true,
          stats: true,
        });
      } else {
        setSectionStates((prev) => ({
          ...prev,
          [section]: true,
        }));

        if (message) {
          updateLoadingMessage(message);
        }
      }
    },
    [startLoading, updateLoadingMessage],
  );

  // Stop loading a specific section
  const stopSectionLoading = useCallback(
    (section: DashboardLoadingSection) => {
      if (section === 'all') {
        stopLoading();
        setSectionStates({
          header: false,
          map: false,
          table: false,
          filters: false,
          stats: false,
        });
      } else {
        setSectionStates((prev) => ({
          ...prev,
          [section]: false,
        }));
      }
    },
    [stopLoading],
  );

  // Update loading message for a specific section
  const updateSectionMessage = useCallback(
    (message: string) => {
      updateLoadingMessage(message);
    },
    [updateLoadingMessage],
  );

  // Automatically stop global loading when all sections are loaded
  useEffect(() => {
    if (!isAnySectionLoading) {
      stopLoading();
    }
  }, [isAnySectionLoading, stopLoading]);

  return {
    sectionStates,
    isAnySectionLoading,
    startSectionLoading,
    stopSectionLoading,
    updateSectionMessage,
  };
}

'use client';

import type { ViewMode } from '@/types';
import { Tab, Tabs } from '@heroui/react';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

/**
 * ViewModeToggle
 * Tabbed switcher between Table, Map, and Split views using HeroUI Tabs.
 */
export function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  return (
    <Tabs
      selectedKey={viewMode}
      onSelectionChange={(key) => setViewMode(key as ViewMode)}
      aria-label="View mode switcher"
      variant="underlined"
    >
      <Tab key="table" title="Table View" />
      <Tab key="map" title="Map View" />
      <Tab key="split" title="Split View" />
    </Tabs>
  );
}

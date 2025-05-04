'use client';

import type { ViewMode } from '@/features/dashboard/types/view';
import { Button, ButtonGroup } from '@heroui/react';

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
    <div className="flex justify-end items-center">
      <ButtonGroup variant="flat">
        <Button
          color={viewMode === 'table' ? 'primary' : 'default'}
          onPress={() => setViewMode('table')}
        >
          Table
        </Button>
        <Button
          color={viewMode === 'map' ? 'primary' : 'default'}
          onPress={() => setViewMode('map')}
        >
          Map
        </Button>
        <Button
          color={viewMode === 'split' ? 'primary' : 'default'}
          onPress={() => setViewMode('split')}
        >
          Split
        </Button>
        <Button
          color={viewMode === 'analytics' ? 'primary' : 'default'}
          onPress={() => setViewMode('analytics')}
        >
          Analytics
        </Button>
      </ButtonGroup>
    </div>
  );
}

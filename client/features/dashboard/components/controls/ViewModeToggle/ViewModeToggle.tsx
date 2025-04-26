'use client';

import type { ViewMode } from '@/features/dashboard/types/view';
import { ThemeSwitch } from '@/shared/components/ui/theme';
import { Button, Link, Popover, PopoverContent, PopoverTrigger, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import { siteConfig } from '@shared/config/site';
import { GithubIcon } from '@shared/icons';
import React, { useCallback, useMemo } from 'react';
import { usePrefetch } from '../../../hooks/usePrefetch';

/**
 * Props for the ViewModeToggle component
 */
interface ViewModeToggleProps {
  /** Current view mode */
  viewMode: ViewMode;
  /** Callback to change the view mode */
  setViewMode: (mode: ViewMode) => void;
  /** Function to fetch data for a specific view */
  fetchViewData?: (view: ViewMode) => Promise<void>;
}

/**
 * ViewModeToggle component
 * Provides controls for switching between different view modes (table, map, analytics)
 * and includes theme switching and GitHub link.
 */
export const ViewModeToggle = React.memo(function ViewModeToggle({
  viewMode,
  setViewMode,
  fetchViewData,
}: ViewModeToggleProps) {
  // Memoize the selection change handler
  const handleSelectionChange = useCallback(
    (key: string | number) => {
      setViewMode(key as ViewMode);
    },
    [setViewMode],
  );

  // Create prefetch functions for each view
  const prefetchTableData = usePrefetch(
    ['dashboard', 'table', 'data'],
    () => fetchViewData?.('table') || Promise.resolve(),
    { enabled: !!fetchViewData },
  );

  const prefetchSplitData = usePrefetch(
    ['dashboard', 'split', 'data'],
    () => fetchViewData?.('split') || Promise.resolve(),
    { enabled: !!fetchViewData },
  );

  const prefetchMapData = usePrefetch(
    ['dashboard', 'map', 'data'],
    () => fetchViewData?.('map') || Promise.resolve(),
    { enabled: !!fetchViewData },
  );

  const prefetchAnalyticsData = usePrefetch(
    ['dashboard', 'analytics', 'data'],
    () => fetchViewData?.('analytics') || Promise.resolve(),
    { enabled: !!fetchViewData },
  );

  // Memoize the tab list class names
  const tabListClassNames = useMemo(
    () => ({
      tabList: 'gap-2',
      cursor: 'w-full bg-primary',
      tab: 'max-w-fit px-2 h-9',
      tabContent: 'group-data-[selected=true]:text-primary',
    }),
    [],
  );

  // Memoize the table tab
  const tableTab = useMemo(
    () => (
      <Tab
        key="table"
        title={
          <div className="flex items-center gap-1.5" onMouseEnter={prefetchTableData}>
            <Icon icon="lucide:table" width={16} />
            <span className="text-sm">Table</span>
          </div>
        }
      />
    ),
    [prefetchTableData],
  );

  // Memoize the split tab
  const splitTab = useMemo(
    () => (
      <Tab
        key="split"
        title={
          <div className="flex items-center gap-1.5" onMouseEnter={prefetchSplitData}>
            <Icon icon="lucide:layout-grid" width={16} />
            <span className="text-sm">Split</span>
          </div>
        }
      />
    ),
    [prefetchSplitData],
  );

  // Memoize the map tab
  const mapTab = useMemo(
    () => (
      <Tab
        key="map"
        title={
          <div className="flex items-center gap-1.5" onMouseEnter={prefetchMapData}>
            <Icon icon="lucide:map" width={16} />
            <span className="text-sm">Map</span>
          </div>
        }
      />
    ),
    [prefetchMapData],
  );

  // Memoize the analytics tab
  const analyticsTab = useMemo(
    () => (
      <Tab
        key="analytics"
        title={
          <div className="flex items-center gap-1.5" onMouseEnter={prefetchAnalyticsData}>
            <Icon icon="lucide:bar-chart-2" width={16} />
            <span className="text-sm">Analytics</span>
          </div>
        }
      />
    ),
    [prefetchAnalyticsData],
  );

  // Memoize the GitHub button
  const githubButton = useMemo(
    () => (
      <Button
        isIconOnly
        variant="light"
        as="a"
        href={siteConfig.links.github}
        target="_blank"
        rel="noreferrer"
        className="text-default-500 hover:text-default-700 rounded-full"
        aria-label="View on GitHub"
      >
        <GithubIcon className="w-5 h-5" />
      </Button>
    ),
    [],
  );

  // Memoize the desktop controls
  const desktopControls = useMemo(
    () => (
      <div className="hidden sm:flex items-center gap-3">
        <ThemeSwitch />
        {githubButton}
      </div>
    ),
    [githubButton],
  );

  return (
    <div className="flex items-center justify-between w-full">
      <Tabs
        aria-label="View mode options"
        selectedKey={viewMode}
        onSelectionChange={handleSelectionChange}
        classNames={tabListClassNames}
      >
        {tableTab}
        {splitTab}
        {mapTab}
        {analyticsTab}
      </Tabs>

      {desktopControls}

      {/* Show dropdown menu on mobile */}
      <div className="sm:hidden">
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Button isIconOnly variant="light" aria-label="More options">
              <Icon icon="lucide:more-horizontal" width={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2 p-2">
              <ThemeSwitch />
              {githubButton}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
});

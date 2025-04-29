'use client';

import type { ViewMode } from '@/features/dashboard/types/view';
import { ThemeSwitch } from '@/shared/components/ui/theme';
import { Button, Popover, PopoverContent, PopoverTrigger, Tab, Tabs, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { siteConfig } from '@shared/config/site';
import { GithubIcon } from '@shared/icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set mounted state after hydration to prevent mismatch
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    async () => {
      await fetchViewData?.('table');
      return {}; // Return an empty object to avoid undefined
    },
    { enabled: !!fetchViewData },
  );

  const prefetchSplitData = usePrefetch(
    ['dashboard', 'split', 'data'],
    async () => {
      await fetchViewData?.('split');
      return {}; // Return an empty object to avoid undefined
    },
    { enabled: !!fetchViewData },
  );

  const prefetchMapData = usePrefetch(
    ['dashboard', 'map', 'data'],
    async () => {
      await fetchViewData?.('map');
      return {}; // Return an empty object to avoid undefined
    },
    { enabled: !!fetchViewData },
  );

  const prefetchAnalyticsData = usePrefetch(
    ['dashboard', 'analytics', 'data'],
    async () => {
      await fetchViewData?.('analytics');
      return {}; // Return an empty object to avoid undefined
    },
    { enabled: !!fetchViewData },
  );

  // Memoize the tab list class names
  const tabListClassNames = useMemo(
    () => ({
      tabList: 'gap-1.5 sm:gap-2',
      cursor: 'w-full bg-primary',
      tab: 'max-w-fit px-2 sm:px-3 h-9',
      tabContent:
        'group-data-[selected=true]:text-primary-foreground dark:group-data-[selected=true]:text-primary',
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
            <Tooltip content="Table View" isDisabled={!isMobile}>
              <Icon icon="lucide:table" width={18} height={18} />
            </Tooltip>
            <span className="text-sm hidden xs:inline-block sm:inline-block">Table</span>
          </div>
        }
      />
    ),
    [prefetchTableData, isMobile],
  );

  // Memoize the split tab
  const splitTab = useMemo(
    () => (
      <Tab
        key="split"
        title={
          <div className="flex items-center gap-1.5" onMouseEnter={prefetchSplitData}>
            <Tooltip content="Split View" isDisabled={!isMobile}>
              <Icon icon="lucide:layout-grid" width={18} height={18} />
            </Tooltip>
            <span className="text-sm hidden xs:inline-block sm:inline-block">Split</span>
          </div>
        }
      />
    ),
    [prefetchSplitData, isMobile],
  );

  // Memoize the map tab
  const mapTab = useMemo(
    () => (
      <Tab
        key="map"
        title={
          <div className="flex items-center gap-1.5" onMouseEnter={prefetchMapData}>
            <Tooltip content="Map View" isDisabled={!isMobile}>
              <Icon icon="lucide:map" width={18} height={18} />
            </Tooltip>
            <span className="text-sm hidden xs:inline-block sm:inline-block">Map</span>
          </div>
        }
      />
    ),
    [prefetchMapData, isMobile],
  );

  // Memoize the analytics tab
  const analyticsTab = useMemo(
    () => (
      <Tab
        key="analytics"
        title={
          <div className="flex items-center gap-1.5" onMouseEnter={prefetchAnalyticsData}>
            <Tooltip content="Analytics View" isDisabled={!isMobile}>
              <Icon icon="lucide:bar-chart-2" width={18} height={18} />
            </Tooltip>
            <span className="text-sm hidden xs:inline-block sm:inline-block">Analytics</span>
          </div>
        }
      />
    ),
    [prefetchAnalyticsData, isMobile],
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

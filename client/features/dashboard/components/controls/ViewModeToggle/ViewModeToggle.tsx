'use client';

import type { ViewMode } from '@/features/dashboard/types/view';
import { ThemeSwitch } from '@/shared/components/ui';
import {
  Button,
  ButtonGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { siteConfig } from '@shared/config/site';
import { GithubIcon } from '@shared/icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

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

  // Create a directly callable function that handles both prefetching and view mode setting
  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      console.log(`Changing view mode to: ${mode} (current: ${viewMode})`);

      // Only process if the mode is different
      if (mode !== viewMode) {
        // Prefetch data if available
        if (fetchViewData) {
          fetchViewData(mode).catch((error) => {
            console.error(`Error prefetching data for ${mode} view:`, error);
          });
        }

        // Set the view mode
        setViewMode(mode);
      }
    },
    [viewMode, setViewMode, fetchViewData],
  );

  // Prefetch functions for hover state
  const handlePrefetch = useCallback(
    (mode: ViewMode) => {
      if (fetchViewData && mode !== viewMode) {
        fetchViewData(mode).catch((error) => {
          console.error(`Error prefetching data for ${mode} view:`, error);
        });
      }
    },
    [fetchViewData, viewMode],
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

  // If not mounted yet, show a placeholder to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex space-x-1 h-9 items-center">
          <div className="w-20 h-7 bg-default-100 rounded-md" />
          <div className="w-20 h-7 bg-default-100 rounded-md" />
          <div className="w-20 h-7 bg-default-100 rounded-md" />
          <div className="w-20 h-7 bg-default-100 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      <ButtonGroup variant="flat" size="sm" fullWidth>
        <Button
          className={`${viewMode === 'table' ? 'bg-primary text-white' : 'bg-default-100'}`}
          onPress={() => handleViewModeChange('table')}
          onMouseEnter={() => handlePrefetch('table')}
        >
          <Icon icon="lucide:list" className="mr-1" />
          Table
        </Button>
        <Button
          className={`${viewMode === 'map' ? 'bg-primary text-white' : 'bg-default-100'}`}
          onPress={() => handleViewModeChange('map')}
          onMouseEnter={() => handlePrefetch('map')}
        >
          <Icon icon="lucide:map" className="mr-1" />
          Map
        </Button>
        <Button
          className={`${viewMode === 'split' ? 'bg-primary text-white' : 'bg-default-100'}`}
          onPress={() => handleViewModeChange('split')}
          onMouseEnter={() => handlePrefetch('split')}
        >
          <Icon icon="lucide:layout-dashboard" className="mr-1" />
          Split
        </Button>
        <Button
          className={`${viewMode === 'analytics' ? 'bg-primary text-white' : 'bg-default-100'}`}
          onPress={() => handleViewModeChange('analytics')}
          onMouseEnter={() => handlePrefetch('analytics')}
        >
          <Icon icon="lucide:bar-chart-2" className="mr-1" />
          Analytics
        </Button>
      </ButtonGroup>

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

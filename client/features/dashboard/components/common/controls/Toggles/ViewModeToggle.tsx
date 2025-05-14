'use client';

import type { ViewMode } from '@/features/dashboard/types/view';
import { ThemeSwitch } from '@/shared/components/ui';
import { logger } from '@/shared/utils/logger';
import { Button, Link, Popover, PopoverContent, PopoverTrigger, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import { siteConfig } from '@shared/config/site';
import { GithubIcon } from '@shared/icons';
import React, { useCallback, useEffect, useState } from 'react';

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

  // Set mounted state after hydration to prevent mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Create a directly callable function that handles both prefetching and view mode setting
  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      logger.debug(`Changing view mode to: ${mode} (current: ${viewMode})`);

      // Only process if the mode is different
      if (mode !== viewMode) {
        // Prefetch data if available
        if (fetchViewData) {
          fetchViewData(mode).catch((error) => {
            logger.error(`Error prefetching data for ${mode} view:`, error);
          });
        }

        // Set the view mode
        setViewMode(mode);
      }
    },
    [viewMode, setViewMode, fetchViewData],
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
    <header className="flex flex-col sm:flex-row items-center justify-between w-full transition-all duration-300 border-b border-divider p-2 sm:p-3 md:p-4 gap-2">
      <div className="flex items-center justify-between w-full sm:w-auto gap-2">
        {/* View Mode Tabs - Full labels on larger screens, icons only on small screens */}
        <Tabs
          selectedKey={viewMode}
          onSelectionChange={(key) => handleViewModeChange(key as ViewMode)}
          aria-label="View mode switcher"
          variant="underlined"
          classNames={{
            base: 'w-auto',
            tabList: 'gap-1 sm:gap-4',
            tab: 'data-[selected=true]:text-primary',
            tabContent: 'group-data-[selected=true]:text-primary',
            cursor: 'bg-primary',
          }}
        >
          <Tab
            key="table"
            title={
              <div className="flex items-center gap-1 sm:gap-2">
                <Icon icon="solar:checklist-bold" width={16} className="sm:w-5" />
                <span className="hidden sm:block text-xs sm:text-sm">Table</span>
              </div>
            }
          />
          <Tab
            key="map"
            title={
              <div className="flex items-center gap-1 sm:gap-2">
                <Icon icon="solar:point-on-map-bold" width={16} className="sm:w-5" />
                <span className="hidden sm:block text-xs sm:text-sm">Map</span>
              </div>
            }
          />
          <Tab
            key="split"
            title={
              <div className="flex items-center gap-1 sm:gap-2">
                <Icon icon="solar:notes-minimalistic-bold" width={16} className="sm:w-5" />
                <span className="hidden sm:block text-xs sm:text-sm">Split</span>
              </div>
            }
          />
          <Tab
            key="analytics"
            title={
              <div className="flex items-center gap-1 sm:gap-2">
                <Icon icon="solar:chart-2-bold" width={16} className="sm:w-5" />
                <span className="hidden sm:block text-xs sm:text-sm">Analytics</span>
              </div>
            }
          />
        </Tabs>

        {/* More menu for mobile - contains GitHub and Theme switch */}
        <div className="block sm:hidden">
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button isIconOnly radius="full" variant="light" size="sm" aria-label="More options">
                <Icon icon="lucide:more-vertical" width={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2">
                <div className="flex flex-col gap-2">
                  <Link
                    isExternal
                    href={siteConfig.links.github}
                    className="flex items-center justify-center"
                  >
                    <GithubIcon className="text-default-500" width={16} />
                  </Link>
                  <div className="flex items-center justify-center">
                    <ThemeSwitch aria-label="Toggle theme" />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Controls for desktop - GitHub and Theme switch */}
      <div className="hidden sm:flex items-center gap-2">
        <Button isIconOnly radius="full" variant="light" size="sm" aria-label="GitHub">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" width={16} />
          </Link>
        </Button>
        <ThemeSwitch aria-label="Toggle theme" />
      </div>
    </header>
  );
});

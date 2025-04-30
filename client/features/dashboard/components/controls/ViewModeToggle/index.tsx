'use client';

import { ThemeSwitch } from '@/shared/components/ui/theme';
import { siteConfig } from '@/shared/config';
import { GithubIcon } from '@/shared/icons';
import { Button, Popover, PopoverContent, PopoverTrigger, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { ViewMode } from '../../../types';

export interface ViewModeToggleProps {
  viewMode: ViewMode;
  setViewMode: (view: ViewMode) => void;
}

export function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after hydration to prevent mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use callback for handle selection to avoid issues
  const handleSelectionChange = useCallback(
    (key: string | number) => {
      if (setViewMode && typeof setViewMode === 'function') {
        console.log(`Changing view mode to: ${key}`);
        setViewMode(key as ViewMode);
      }
    },
    [setViewMode],
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
        classNames={{
          tabList: 'gap-1.5 sm:gap-2',
          cursor: 'w-full bg-primary',
          tab: 'max-w-fit px-2 sm:px-3 h-9',
          tabContent:
            'group-data-[selected=true]:text-primary-foreground dark:group-data-[selected=true]:text-primary',
        }}
      >
        <Tab
          key="table"
          title={
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:list" width={18} height={18} />
              <span className="text-sm">Table</span>
            </div>
          }
        />
        <Tab
          key="map"
          title={
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:map" width={18} height={18} />
              <span className="text-sm">Map</span>
            </div>
          }
        />
        <Tab
          key="split"
          title={
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:layout-dashboard" width={18} height={18} />
              <span className="text-sm">Split</span>
            </div>
          }
        />
        <Tab
          key="analytics"
          title={
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:bar-chart-2" width={18} height={18} />
              <span className="text-sm">Analytics</span>
            </div>
          }
        />
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
}

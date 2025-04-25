'use client';

import type { ViewMode } from '@/features/dashboard/types';
import { ThemeSwitch } from '@/shared/components/ui/theme';
import { Button, Link, Popover, PopoverContent, PopoverTrigger, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import { siteConfig } from '@shared/config/site';
import { GithubIcon } from '@shared/icons';

/**
 * Props for the ViewModeToggle component
 */
interface ViewModeToggleProps {
  /** Current view mode */
  viewMode: ViewMode;
  /** Callback to change the view mode */
  setViewMode: (mode: ViewMode) => void;
}

/**
 * ViewModeToggle component
 * Provides controls for switching between different view modes (table, map, analytics)
 * and includes theme switching and GitHub link.
 */
export function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <Tabs
        aria-label="View mode options"
        selectedKey={viewMode}
        onSelectionChange={(key) => setViewMode(key as ViewMode)}
        classNames={{
          tabList: 'gap-2',
          cursor: 'w-full bg-primary',
          tab: 'max-w-fit px-2 h-9',
          tabContent: 'group-data-[selected=true]:text-primary',
        }}
      >
        <Tab
          key="table"
          title={
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:table" width={16} />
              <span className="text-sm">Table</span>
            </div>
          }
        />
        <Tab
          key="split"
          title={
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:layout-grid" width={16} />
              <span className="text-sm">Split</span>
            </div>
          }
        />
        <Tab
          key="map"
          title={
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:map" width={16} />
              <span className="text-sm">Map</span>
            </div>
          }
        />
        <Tab
          key="analytics"
          title={
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:bar-chart-2" width={16} />
              <span className="text-sm">Analytics</span>
            </div>
          }
        />
      </Tabs>

      <div className="flex items-center gap-3">
        {/* Show theme switch and GitHub link directly on larger screens */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeSwitch />
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
        </div>

        {/* Show dropdown menu on mobile */}
        <div className="sm:hidden">
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                isIconOnly
                variant="light"
                className="text-default-500 hover:text-default-700"
                aria-label="More options"
              >
                <Icon icon="lucide:more-horizontal" width={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center gap-2">
                  <ThemeSwitch />
                  <span className="text-sm">Theme</span>
                </div>
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-default-600 hover:text-default-900"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span className="text-sm">View on GitHub</span>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

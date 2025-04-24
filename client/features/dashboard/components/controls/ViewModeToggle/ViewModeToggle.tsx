'use client';

import { ThemeSwitch } from '@/components/ui/Theme/ThemeSwitch';
import { siteConfig } from '@/config/site';
import { GithubIcon } from '@/icons';
import type { ViewMode } from '@/types';
import { Button, Link, Popover, PopoverContent, PopoverTrigger, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';

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
    <header className="flex sm:flex-row items-center justify-between w-full transition-all duration-300 border-b border-divider p-2 sm:p-3 md:p-4 gap-2">
      <div className="flex items-center justify-between w-full sm:w-auto gap-2">
        {/* View Mode Tabs - Full labels on larger screens, icons only on small screens */}
        <Tabs
          selectedKey={viewMode}
          onSelectionChange={(key) => setViewMode(key as ViewMode)}
          aria-label="View mode switcher"
          variant="underlined"
          classNames={{
            base: 'w-auto',
            tabList: 'gap-1 sm:gap-4',
          }}
        >
          <Tab
            key="table"
            title={
              <div className="flex items-center gap-1 sm:gap-2">
                <Icon icon="lucide:table" width={16} className="sm:w-5" />
                <span className="hidden sm:block text-xs sm:text-sm">Table</span>
              </div>
            }
          />
          <Tab
            key="map"
            title={
              <div className="flex items-center gap-1 sm:gap-2">
                <Icon icon="lucide:map" width={16} className="sm:w-5" />
                <span className="hidden sm:block text-xs sm:text-sm">Map</span>
              </div>
            }
          />
          <Tab
            key="split"
            title={
              <div className="flex items-center gap-1 sm:gap-2">
                <Icon icon="lucide:layout-panel-left" width={16} className="sm:w-5" />
                <span className="hidden sm:block text-xs sm:text-sm">Split</span>
              </div>
            }
          />
          <Tab
            key="analytics"
            title={
              <div className="flex items-center gap-1 sm:gap-2">
                <Icon icon="lucide:bar-chart-3" width={16} className="sm:w-5" />
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
}

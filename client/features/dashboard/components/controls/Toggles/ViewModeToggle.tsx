'use client';

import type { ViewMode } from '@/features/dashboard/types/view';
import { ThemeSwitch } from '@/shared/components/ui/ThemeSwitch';
import { Button, ButtonGroup } from '@heroui/react';
import { siteConfig } from '@shared/config';
import { GithubIcon } from '@shared/icons';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

/**
 * ViewModeToggle
 * Tabbed switcher between Table, Map, and Split views using HeroUI Tabs.
 * Also includes theme toggle and GitHub link on the right side.
 */
export function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  return (
    <div className="flex justify-between items-center w-full">
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

      {/* Theme and GitHub buttons */}
      <div className="flex items-center gap-1 px-2 py-1">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          aria-label="GitHub"
          as="a"
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon className="text-default-700" />
        </Button>
        <ThemeSwitch />
      </div>
    </div>
  );
}

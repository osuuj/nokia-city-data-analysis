'use client';

import { Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';
import type { ViewMode } from '../../../types';

export interface ViewModeToggleProps {
  activeView: ViewMode;
  onChange?: (view: ViewMode) => void;
}

export function ViewModeToggle({ activeView, onChange = () => {} }: ViewModeToggleProps) {
  // Use callback for handle selection to avoid issues
  const handleSelectionChange = React.useCallback(
    (key: string | number) => {
      if (onChange && typeof onChange === 'function') {
        onChange(key as ViewMode);
      }
    },
    [onChange],
  );

  return (
    <Tabs
      aria-label="View mode options"
      selectedKey={activeView}
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
  );
}

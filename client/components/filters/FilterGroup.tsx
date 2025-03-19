'use client';

import DistanceSlider from '@/components/filters/DistanceSlider';
import PopoverFilterWrapper from '@/components/filters/PopoverFilterWrapper';
import TagGroupItem from '@/components/filters/TagGroupItem';
import type { FilterGroupProps } from '@/components/table/tableConfig';
import { filters } from '@/components/utils/filters';
import { CheckboxGroup, Input, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';

export default function FilterGroup({
  useLocation,
  setUseLocation,
  address,
  setAddress,
}: FilterGroupProps) {
  // ✅ Restored: Clear address when location is enabled
  useEffect(() => {
    if (useLocation) {
      setAddress('');
    }
  }, [useLocation, setAddress]);

  const industryFilter = filters.find((filter) => filter.key === 'industries');

  return (
    <div className="flex gap-3 overflow-x-auto whitespace-nowrap snap-x snap-mandatory">
      {/* Industry Filter */}
      <PopoverFilterWrapper title="Industry">
        <div className="max-h-60 overflow-y-auto transition-all duration-300 ease-in-out hover:w-72">
          <CheckboxGroup aria-label="Select industry" className="gap-1" orientation="vertical">
            {industryFilter?.options?.map(
              (option: { value: string; icon?: string; title: string }) => (
                <TagGroupItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon icon={option.icon || ''} className="text-lg" />
                    {option.title}
                  </div>
                </TagGroupItem>
              ),
            )}
          </CheckboxGroup>
        </div>
      </PopoverFilterWrapper>

      {/* Distance Filter */}
      <PopoverFilterWrapper title="Distance">
        <div className="flex flex-col gap-2">
          <Switch isSelected={useLocation} onValueChange={setUseLocation}>
            Share location
          </Switch>
          {!useLocation && (
            <Input
              aria-label="Enter address"
              placeholder="Enter address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          )}
          {useLocation && (
            <DistanceSlider
              aria-label="Distance Filter"
              range={{
                min: 0,
                defaultValue: [0, 30],
                max: 30,
                step: 1,
              }}
            />
          )}
        </div>
      </PopoverFilterWrapper>
    </div>
  );
}

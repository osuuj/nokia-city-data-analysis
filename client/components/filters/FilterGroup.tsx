'use client';

import DistanceSlider from '@/components/filters/DistanceSlider';
import PopoverFilterWrapper from '@/components/filters/PopoverFilterWrapper';
import TagGroupItem from '@/components/filters/TagGroupItem';
import type { FilterGroupProps } from '@/components/table/tableConfig';
import { filters } from '@/components/utils/filters';
import { useCompanyStore } from '@/store/useCompanyStore';
import { CheckboxGroup, Input, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

export default function FilterGroup({
  useLocation,
  setUseLocation,
  address,
  setAddress,
}: FilterGroupProps) {
  const selectedIndustries = useCompanyStore((s) => s.selectedIndustries);
  const setSelectedIndustries = useCompanyStore((s) => s.setSelectedIndustries);
  const industryFilter = filters.find((filter) => filter.key === 'industries');
  const toggleIndustry = useCompanyStore((s) => s.toggleIndustry);
  const [draftIndustries, setDraftIndustries] = useState<string[]>(selectedIndustries);

  useEffect(() => {
    if (useLocation) {
      setAddress('');
    }
  }, [useLocation, setAddress]);

  useEffect(() => {
    setDraftIndustries(selectedIndustries);
  }, [selectedIndustries]);

  return (
    <div className="flex gap-2 whitespace-nowrap">
      {/* Industry Filter */}
      <PopoverFilterWrapper
        title="Industry"
        onApply={() => setSelectedIndustries(draftIndustries)}
        onCancel={() => setDraftIndustries(selectedIndustries)}
      >
        <div className="max-h-60 overflow-y-auto  transition-all duration-300">
          <CheckboxGroup
            aria-label="Select industry"
            className="gap-1"
            orientation="vertical"
            value={draftIndustries}
            onChange={(vals) => setDraftIndustries(vals)}
          >
            {industryFilter?.options?.map((option) => (
              <TagGroupItem key={option.value} value={option.value} className="p-6">
                <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                  <Icon icon={option.icon || ''} className="text-xs md:text-sm" />
                  {option.title}
                </div>
              </TagGroupItem>
            ))}
          </CheckboxGroup>
        </div>
      </PopoverFilterWrapper>

      {/* Distance Filter */}
      <PopoverFilterWrapper
        title="Distance"
        onApply={() => setSelectedIndustries(draftIndustries)}
        onCancel={() => setDraftIndustries(selectedIndustries)}
      >
        <div className="flex flex-col gap-2">
          <Switch
            isSelected={useLocation}
            onValueChange={(value: boolean) => {
              if (typeof setUseLocation === 'function') {
                console.log('Switch toggled, new value:', value);
                setUseLocation(value); // ✅ This will only run if it's a function
              } else {
                console.error('setUseLocation is not a function', setUseLocation);
              }
            }}
            size="sm"
          >
            Share location
          </Switch>
          {!useLocation && (
            <Input
              aria-label="Enter address"
              placeholder="Enter address..."
              value={address}
              size="sm"
              classNames={{
                input: 'text-xs md:text-sm',
                inputWrapper: 'h-8 md:h-10',
              }}
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
              classNames={{
                base: 'py-1 md:py-2',
                label: 'text-xs md:text-sm',
              }}
            />
          )}
        </div>
      </PopoverFilterWrapper>
    </div>
  );
}

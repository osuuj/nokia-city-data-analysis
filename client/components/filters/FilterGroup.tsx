'use client';

import DistanceSlider from '@/components/filters/DistanceSlider';
import PopoverFilterWrapper from '@/components/filters/PopoverFilterWrapper';
import TagGroupItem from '@/components/filters/TagGroupItem';
import { useCompanyStore } from '@/store/useCompanyStore';
import type { FilterGroupProps } from '@/types/table';
import { filters } from '@/utils/filters';
import { requestBrowserLocation } from '@/utils/geo';
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
  const [draftDistance, setDraftDistance] = useState<number>(0);
  const userLocation = useCompanyStore((s) => s.userLocation);
  const setUserLocation = useCompanyStore((s) => s.setUserLocation);
  const distanceLimit = useCompanyStore((s) => s.distanceLimit);
  const setDistanceLimit = useCompanyStore((s) => s.setDistanceLimit);

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
        onApply={() => {
          setDistanceLimit(draftDistance);
        }}
        onCancel={() => {
          setDraftDistance(distanceLimit ?? 30);
        }}
      >
        <div className="flex flex-col gap-2">
          <Switch
            isSelected={useLocation}
            onValueChange={async (value: boolean) => {
              if (value) {
                try {
                  const coords = await requestBrowserLocation();
                  console.log('User location:', coords);
                  setUserLocation(coords);
                  setUseLocation(true);
                } catch (error) {
                  console.error('Location error:', error);
                  setUseLocation(false);
                  setUserLocation(null);
                  alert(
                    'We couldn’t access your location. Please enable location access in your browser.',
                  );
                }
              } else {
                setUseLocation(false);
                setUserLocation(null);
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
          {useLocation && userLocation && (
            <DistanceSlider
              aria-label="Distance Filter"
              minValue={0}
              maxValue={30}
              step={1}
              value={draftDistance}
              onChange={(val) => setDraftDistance(val as number)}
              className="py-1 md:py-2 text-xs md:text-sm"
            />
          )}

          {useLocation && !userLocation && (
            <p className="text-xs text-default-500">Waiting for location permission...</p>
          )}
        </div>
      </PopoverFilterWrapper>
    </div>
  );
}

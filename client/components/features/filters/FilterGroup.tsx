'use client';

import { PopoverFilterWrapper } from '@/components/ui/Popover/PopoverFilterWrapper';
import { DistanceSlider } from '@/components/ui/Slider/DistanceSlider';
import { useCompanyStore } from '@/store/useCompanyStore';
import type { FilterGroupProps, FilterOption } from '@/types';
import { filters, requestBrowserLocation } from '@/utils';
import {
  Button,
  CheckboxGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Switch,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import { TagGroupItem } from './TagGroupItem';

/**
 * FilterGroup
 * Groups industry and distance filters into a reusable popover component in the toolbar.
 */
export const FilterGroup = ({
  useLocation,
  setUseLocation,
  address,
  setAddress,
}: FilterGroupProps) => {
  const selectedIndustries = useCompanyStore((s) => s.selectedIndustries);
  const setSelectedIndustries = useCompanyStore((s) => s.setSelectedIndustries);
  const toggleIndustry = useCompanyStore((s) => s.toggleIndustry);
  const [draftIndustries, setDraftIndustries] = useState<string[]>(selectedIndustries);
  const [draftDistance, setDraftDistance] = useState<number>(0);
  const userLocation = useCompanyStore((s) => s.userLocation);
  const setUserLocation = useCompanyStore((s) => s.setUserLocation);
  const distanceLimit = useCompanyStore((s) => s.distanceLimit);
  const setDistanceLimit = useCompanyStore((s) => s.setDistanceLimit);

  const industryFilter = filters.find((filter) => filter.key === 'industries');

  // For mobile screens, use a dropdown instead of popovers
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [showMobileMenu, setShowMobileMenu] = useState<string | null>(null);

  useEffect(() => {
    if (useLocation) {
      setAddress('');
    }
  }, [useLocation, setAddress]);

  useEffect(() => {
    setDraftIndustries(selectedIndustries);
  }, [selectedIndustries]);

  useEffect(() => {
    setDraftDistance(distanceLimit ?? 0);
  }, [distanceLimit]);

  const handleGetLocation = async () => {
    try {
      const coords = await requestBrowserLocation();
      console.log('User location:', coords);
      setUserLocation(coords);
      setUseLocation(true);
    } catch (error) {
      console.error('Location error:', error);
      setUseLocation(false);
      setUserLocation(null);
      alert("We couldn't access your location. Please enable location access in your browser.");
    }
  };

  // Unified view for both mobile and desktop
  return (
    <div className="flex gap-2 whitespace-nowrap">
      {/* Industry Filter */}
      <PopoverFilterWrapper
        title="Industry"
        onApply={() => setSelectedIndustries(draftIndustries)}
        onCancel={() => setDraftIndustries(selectedIndustries)}
        icon="lucide:tag"
        maxWidth={isMobile ? '280px' : undefined}
      >
        <div className="max-h-60 overflow-y-auto transition-all duration-300">
          <CheckboxGroup
            aria-label="Select industry"
            className="gap-1"
            orientation="vertical"
            value={draftIndustries}
            onChange={(vals: string[]) => setDraftIndustries(vals)}
          >
            {(industryFilter?.options ?? []).map((option: FilterOption) => (
              <TagGroupItem key={option.value} value={option.value} className="p-6">
                <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                  {option.icon && <Icon icon={option.icon} className="text-xs md:text-sm" />}
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
        onApply={() => setDistanceLimit(draftDistance)}
        onCancel={() => setDraftDistance(distanceLimit ?? 0)}
        icon="lucide:map-pin"
        maxWidth={isMobile ? '280px' : undefined}
      >
        <div className="flex flex-col gap-2">
          <Switch
            isSelected={useLocation}
            onValueChange={async (value: boolean) => {
              if (value) {
                await handleGetLocation();
              } else {
                setUseLocation(false);
                setUserLocation(null);
              }
            }}
            size={isMobile ? 'sm' : 'md'}
            classNames={{
              base: 'h-5 xs:h-6 sm:h-7',
              wrapper: 'h-4 xs:h-5 sm:h-6',
              thumb: 'w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5',
            }}
          >
            <span className="text-[10px] xs:text-xs sm:text-sm">Share location</span>
          </Switch>

          {!useLocation && (
            <Input
              aria-label="Enter address"
              placeholder="Enter address..."
              value={address}
              size="sm"
              classNames={{
                input: 'text-[10px] xs:text-xs sm:text-sm',
                inputWrapper: 'h-6 xs:h-7 sm:h-8',
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
              className="py-1 text-[10px] xs:text-xs sm:text-sm"
            />
          )}

          {useLocation && !userLocation && (
            <p className="text-[10px] xs:text-xs sm:text-sm text-default-500">
              Waiting for location permission...
            </p>
          )}
        </div>
      </PopoverFilterWrapper>
    </div>
  );
};

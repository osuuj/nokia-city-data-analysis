'use client';

import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';
import type { Filter, FilterOption } from '@/features/dashboard/types/filters';
import type { FilterGroupProps } from '@/features/dashboard/types/table';
import { filters } from '@/features/dashboard/utils/filters';
import { requestBrowserLocation } from '@/features/dashboard/utils/geo';
import { AccessibleIconify } from '@/shared/icons/AccessibleIconify';
import {
  Button,
  CheckboxGroup,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Switch,
  Tooltip,
} from '@heroui/react';
import React, { useEffect, useState } from 'react';
import { DistanceSlider } from './DistanceSlider';
import { PopoverFilterWrapper } from './PopoverFilterWrapper';
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

  const industryFilter = filters.find((filter: Filter) => filter.key === 'industries');

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
      // Handle the error gracefully without showing an alert
      console.log('Location access denied by user');
      setUseLocation(false);
      setUserLocation(null);
    }
  };

  // Unified view for both mobile and desktop
  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      {/* Industry Filter */}
      <Tooltip content="Filter by industry" placement="bottom">
        <div>
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
                      {option.icon && (
                        <AccessibleIconify
                          icon={option.icon}
                          width={16}
                          className={`${option.color || 'text-default-400'}`}
                          ariaLabel={`${option.title} industry icon`}
                        />
                      )}
                      {option.title}
                    </div>
                  </TagGroupItem>
                ))}
              </CheckboxGroup>
            </div>
          </PopoverFilterWrapper>
        </div>
      </Tooltip>

      <Divider className="hidden md:block h-4 xs:h-5" orientation="vertical" />

      {/* Distance Filter */}
      <Tooltip content="Filter by distance" placement="bottom">
        <div>
          <PopoverFilterWrapper
            title="Distance"
            onApply={() => setDistanceLimit(draftDistance)}
            onCancel={() => {
              setDraftDistance(distanceLimit ?? 0);
              // If location was denied, also reset the useLocation state
              if (!userLocation) {
                setUseLocation(false);
              }
            }}
            icon="lucide:map-pin"
            maxWidth={isMobile ? '280px' : undefined}
          >
            <div className="flex flex-col gap-2">
              <Switch
                isSelected={useLocation}
                onValueChange={async (value: boolean) => {
                  if (value) {
                    try {
                      await handleGetLocation();
                    } catch (error) {
                      // If location access is denied, the popover will be closed by the onCancel handler
                      console.log('Location access denied by user');
                    }
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
                <p className="text-[10px] xs:text-xs sm:text-sm text-default-500">
                  Enable location sharing to filter by distance
                </p>
              )}

              {useLocation && userLocation && (
                <DistanceSlider
                  aria-label="Distance Filter"
                  minValue={0}
                  maxValue={30}
                  step={1}
                  value={draftDistance}
                  onChange={(val: number) => setDraftDistance(val)}
                  className="py-1 text-[10px] xs:text-xs sm:text-sm"
                  tooltipContent="Adjust distance range"
                />
              )}
            </div>
          </PopoverFilterWrapper>
        </div>
      </Tooltip>
    </div>
  );
};

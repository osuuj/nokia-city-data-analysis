'use client';

import { filters } from '@/features/dashboard/data/filters';
import type { FilterGroupProps, FilterOption } from '@/features/dashboard/types';
import { requestBrowserLocation } from '@/features/dashboard/utils/geo';
import { CheckboxGroup, Divider, Switch, Tooltip } from '@heroui/react';
import { AccessibleIconify } from '@shared/icons';
import { useEffect, useState } from 'react';
import { DistanceSlider } from './DistanceSlider';
import { PopoverFilterWrapper } from './PopoverFilterWrapper';
import { TagGroupItem } from './TagGroupItem';

/**
 * FilterGroup
 * Groups industry and distance filters into a reusable popover component in the toolbar.
 */
export const FilterGroup = ({ useLocation, setUseLocation, setAddress }: FilterGroupProps) => {
  const selectedIndustries: string[] = [];
  const setSelectedIndustries = () => {};
  const userLocation = undefined;
  const setUserLocation = () => {};
  const distanceLimit = undefined;
  const setDistanceLimit = () => {};

  const industryFilter = filters.find((filter) => filter.key === 'industries');

  // For mobile screens, use a dropdown instead of popovers
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (useLocation) {
      setAddress('');
    }
  }, [useLocation, setAddress]);

  useEffect(() => {
    setDraftIndustries(selectedIndustries);
  }, []);

  useEffect(() => {
    setDraftDistance(distanceLimit ?? 0);
  }, [distanceLimit]);

  const handleGetLocation = async () => {
    try {
      const coords = await requestBrowserLocation();
      setUserLocation(coords);
      setUseLocation(true);
    } catch (error) {
      // Handle the error gracefully without showing an alert
      setUseLocation(false);
      setUserLocation(null);
    }
  };

  // Unified view for both mobile and desktop
  return (
    <div className="flex items-center gap-1 sm:gap-2  whitespace-nowrap">
      {/* Industry Filter */}
      <Tooltip content="Filter by industry" placement="bottom">
        <div>
          <PopoverFilterWrapper
            title="Industry"
            onApply={() => {
              if (draftIndustries.length !== selectedIndustries.length) {
                setTimeout(() => {
                  setSelectedIndustries(draftIndustries);
                }, 50);
              } else {
                setSelectedIndustries(draftIndustries);
              }
            }}
            onCancel={() => {
              setDraftIndustries(selectedIndustries);
            }}
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

      <Divider className="hidden sm:block h-4 xs:h-5" orientation="vertical" />

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
                <div className="flex flex-col gap-1">
                  <DistanceSlider
                    aria-label="Distance Filter"
                    minValue={0}
                    maxValue={30}
                    step={1}
                    value={draftDistance}
                    onChange={(val) => setDraftDistance(val as number)}
                    className="py-1 text-[10px] xs:text-xs sm:text-sm w-full"
                  />
                </div>
              )}
            </div>
          </PopoverFilterWrapper>
        </div>
      </Tooltip>
    </div>
  );
};

'use client';

import ColorRadioItem from '@/components/filters/color-radio-item';
import DistanceSlider from '@/components/filters/distance-slider';
import type { Filter } from '@/components/filters/filters-types';
import { FilterTypeEnum } from '@/components/filters/filters-types';
import RatingRadioGroup from '@/components/filters/rating-radio-group';
import TagGroupItem from '@/components/filters/tag-group-item';
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  NumberInput,
  RadioGroup,
  Switch,
  Tab,
  Tabs,
  cn,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useCallback, useState } from 'react';

export type FiltersWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  items: Filter[];
  title?: string;
  showTitle?: boolean;
  showActions?: boolean;
  className?: string;
  scrollShadowClassName?: string;
};

const FiltersWrapper = React.forwardRef<HTMLDivElement, FiltersWrapperProps>(
  ({ items, title = 'Filters', showTitle = false, showActions = true, className }, ref) => {
    const [selectedToggles, setSelectedToggles] = useState<Record<string, boolean>>({});

    const handleToggleChange = useCallback((value: string) => {
      setSelectedToggles((prev) => ({
        ...prev,
        [value]: !prev[value], // Dynamic key update remains, no unnecessary complexity
      }));
    }, []);

    const renderFilter = useCallback(
      (filter: Filter) => {
        switch (filter.type) {
          case FilterTypeEnum.Tabs:
            return (
              <Tabs fullWidth aria-label={filter.title}>
                {filter.options?.map((option) => (
                  <Tab key={option.value} title={option.title} />
                ))}
              </Tabs>
            );
          case FilterTypeEnum.Rating:
            return <RatingRadioGroup />;
          case FilterTypeEnum.TagGroup:
            return (
              <CheckboxGroup
                aria-label="Select amenities"
                className="gap-1"
                orientation="horizontal"
              >
                {filter.options?.map((option) => (
                  <TagGroupItem key={option.value} icon={option.icon} value={option.value}>
                    {option.title}
                  </TagGroupItem>
                ))}
              </CheckboxGroup>
            );
          case FilterTypeEnum.Toggle:
            return (
              <div className="-mx-4 flex-col px-6">
                {filter.options?.map((option) => (
                  <Switch
                    key={option.value}
                    value={option.value}
                    isSelected={selectedToggles[option.value] || false}
                    onChange={() => handleToggleChange(option.value)}
                  >
                    {option.title}
                  </Switch>
                ))}
              </div>
            );
          case FilterTypeEnum.CheckboxGroup:
            return (
              <Accordion variant="bordered">
                <AccordionItem key="options" title={filter.title}>
                  <CheckboxGroup aria-label={filter.title}>
                    {filter.options?.map((option) => (
                      <Checkbox key={option.value} value={option.value}>
                        <span className="text-small font-normal">{option.title}</span>
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </AccordionItem>
              </Accordion>
            );
          case FilterTypeEnum.Color:
            return (
              <RadioGroup aria-label={filter.title}>
                {filter.options?.map((option) => (
                  <ColorRadioItem key={option.value} color={option.color} value={option.value} />
                ))}
              </RadioGroup>
            );
        }
      },
      [selectedToggles, handleToggleChange],
    );

    return (
      <div
        ref={ref}
        className={cn('h-full max-h-80 w-full max-w-sm rounded-medium p-1', className)}
      >
        {showTitle && (
          <>
            <h2 className="text-medium font-medium text-foreground">{title}</h2>
            <Divider className="my-3 bg-default-100" />
          </>
        )}

        {items.length === 0 ? (
          <p className="text-center text-small text-default-500">Loading filters...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map((filter) => (
              <div key={filter.title} className="flex flex-col gap-3">
                {filter.type !== FilterTypeEnum.CheckboxGroup ? (
                  <div>
                    <h3 className="text-base font-medium leading-8 text-foreground">
                      {filter.title}
                    </h3>
                    <p className="text-small text-default-500">{filter.description}</p>
                  </div>
                ) : null}
                {renderFilter(filter)}
              </div>
            ))}
          </div>
        )}

        {/* Conditionally render DistanceSlider if "Share Location" is selected */}
        {selectedToggles.userLocation && (
          <div className="mt-4">
            <h3 className="text-base font-medium leading-8 text-foreground">Maximum Distance</h3>
            <p className="text-small text-default-500">
              Adjust the maximum distance from your location
            </p>
            <DistanceSlider
              aria-label="Maximum distance"
              range={{ min: 0, max: 150, step: 5, defaultValue: [0, 900] }}
            />
          </div>
        )}
        {/* Conditionally render NumberInput when "Number of Companies" is selected */}
        {selectedToggles.companiesCount && (
          <div className="mt-4">
            <h3 className="text-base font-medium leading-8 text-foreground">Number of Companies</h3>
            <p className="text-small text-default-500 ">Specify the number of companies</p>
            <NumberInput
              isDisabled={false} // ✅ Enable input when toggle is active
              aria-label="Number of Companies"
              className="max-w-xs py-2"
              placeholder="1"
            />
          </div>
        )}

        {showActions && (
          <>
            <Divider className="my-6 bg-default-100 " />
            <div className="mt-auto flex flex-col gap-3 pb-8">
              <Button
                color="primary"
                startContent={
                  <Icon
                    className="text-primary-foreground [&>g]:stroke-[3px]"
                    icon="solar:magnifer-linear"
                    width={16}
                  />
                }
              >
                Set Filters
              </Button>
              <Button className="text-default-500" variant="flat">
                Clear all filters
              </Button>
            </div>
          </>
        )}
      </div>
    );
  },
);

FiltersWrapper.displayName = 'FiltersWrapper';

export default FiltersWrapper;

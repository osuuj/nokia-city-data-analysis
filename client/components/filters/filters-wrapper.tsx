'use client';

import ColorRadioItem from '@/components/filters/color-radio-item';
import type { Filter } from '@/components/filters/filters-types';
import { FilterTypeEnum } from '@/components/filters/filters-types';
import PriceSlider from '@/components/filters/price-slider';
import RatingRadioGroup from '@/components/filters/rating-radio-group';
import TagGroupItem from '@/components/filters/tag-group-item';
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  RadioGroup,
  Switch,
  Tab,
  Tabs,
  cn,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useCallback } from 'react';

export type FiltersWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  items: Filter[];
  title?: string;
  showTitle?: boolean;
  showActions?: boolean;
  className?: string;
  scrollShadowClassName?: string;
};

const FiltersWrapper = React.forwardRef<HTMLDivElement, FiltersWrapperProps>(
  (
    {
      items,
      title = 'Filters',
      showTitle = false,
      showActions = true,
      className,
      scrollShadowClassName,
    },
    ref,
  ) => {
    const renderFilter = useCallback((filter: Filter) => {
      switch (filter.type) {
        case FilterTypeEnum.Tabs:
          return (
            <Tabs fullWidth aria-label={filter.title}>
              {filter.options?.map((option) => (
                <Tab key={option.value} title={option.title} />
              ))}
            </Tabs>
          );
        case FilterTypeEnum.PriceRange:
          return <PriceSlider aria-label={filter.title} range={filter.range} />;
        case FilterTypeEnum.Rating:
          return <RatingRadioGroup />;
        case FilterTypeEnum.TagGroup:
          return (
            <CheckboxGroup aria-label="Select amenities" className="gap-1" orientation="horizontal">
              {filter.options?.map((option) => (
                <TagGroupItem key={option.value} icon={option.icon} value={option.value}>
                  {option.title}
                </TagGroupItem>
              ))}
            </CheckboxGroup>
          );
        case FilterTypeEnum.Toggle:
          return (
            <div className="-mx-4 flex flex-col">
              {filter.options?.map((option) => (
                <Switch key={option.value} value={option.value}>
                  {option.title}
                </Switch>
              ))}
            </div>
          );
        case FilterTypeEnum.CheckboxGroup:
          return (
            <Accordion>
              <AccordionItem key="options" title={filter.title}>
                <CheckboxGroup aria-label={filter.title}>
                  {filter.options?.map((option) => (
                    <Checkbox key={option.value} value={option.value}>
                      {option.title}
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
    }, []);

    return (
      <div
        ref={ref}
        className={cn('h-full max-h-80 w-full max-w-sm rounded-medium p-1', className)}
      >
        {showTitle && (
          <>
            <h2 className="text-large font-medium text-foreground">{title}</h2>
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
                    <h3 className="text-small font-medium leading-8 text-default-500">
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
                Show 300+ stays
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

'use client';

import type { DistanceSliderProps } from '@/features/dashboard/types';
import { clampValue } from '@/features/dashboard/utils/number';
import { Input, Slider, cn } from '@heroui/react';
import React, { useCallback, useMemo } from 'react';

const DistanceSliderPip: React.FC<{ index: number; totalPips: number; isInRange: boolean }> = ({
  index,
  totalPips,
  isInRange,
}) => {
  const height = `${clampValue((index / totalPips) * 100, 0, 100)}%`;

  return (
    <span
      className="relative h-1 w-1 rounded-full bg-default-100 after:absolute after:bottom-0 after:h-0 after:w-full after:rounded-full after:bg-primary after:transition-all after:!duration-500 after:content-[''] data-[in-range=true]:after:h-full"
      data-in-range={isInRange}
      style={{ height }}
    />
  );
};

/**
 * DistanceSlider
 * A combined slider + number input component for selecting distance in kilometers.
 */
export const DistanceSlider = React.forwardRef<HTMLDivElement, DistanceSliderProps>(
  ({ className, value, onChange, minValue = 0, maxValue = 100, step = 1, ...props }, ref) => {
    // Adjust pip count based on screen size
    const totalPips = typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 15;

    const rangePips = useMemo(() => {
      return Array.from({ length: totalPips }, (_, i) => {
        const pipValue = (i / (totalPips - 1)) * maxValue;
        const isInRange = pipValue <= value;

        return (
          <DistanceSliderPip
            key={`pip-${pipValue}`}
            index={i}
            totalPips={totalPips}
            isInRange={isInRange}
          />
        );
      });
    }, [value, maxValue, totalPips]);

    const onInputValueChange = useCallback(
      (inputValue: string) => {
        const newValue = Number(inputValue);
        if (!Number.isNaN(newValue)) {
          onChange(clampValue(newValue, minValue, maxValue));
        }
      },
      [onChange, minValue, maxValue],
    );

    return (
      <div className={cn('flex flex-col gap-1 xs:gap-2 sm:gap-3', className)}>
        <div className="flex flex-col gap-1">
          <div className="flex h-6 xs:h-7 sm:h-8 w-full items-end justify-between px-1 sm:px-2">
            {rangePips}
          </div>
          <Slider
            {...props}
            ref={ref}
            minValue={minValue}
            maxValue={maxValue}
            step={step}
            value={value}
            onChange={(val) => {
              if (typeof val === 'number') onChange(val);
            }}
            size="sm"
            aria-label="Distance in kilometers"
            classNames={{
              base: 'py-1',
              track: 'h-1',
              thumb: 'h-3 w-3 xs:h-3 xs:w-3 sm:h-4 sm:w-4',
            }}
          />
        </div>
      </div>
    );
  },
);

DistanceSlider.displayName = 'DistanceSlider';

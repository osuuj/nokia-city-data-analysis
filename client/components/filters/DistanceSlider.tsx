'use client';

import type { RangeFilter } from '@/components/utils/filtersTypes';
import type { SliderProps } from '@heroui/react';

import { Input, Slider, cn } from '@heroui/react';
import React, { useCallback, useMemo, useState } from 'react';

export type DistanceSliderProps = Omit<SliderProps, 'ref'> & {
  range?: RangeFilter;
  animation?: 'opacity' | 'height';
};

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

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

const DistanceSlider = React.forwardRef<HTMLDivElement, DistanceSliderProps>(
  ({ range, className, ...props }, ref) => {
    const defaultValue = typeof range?.defaultValue === 'number' ? range.defaultValue : 0;
    const [value, setValue] = useState<number>(defaultValue);
    const maxDistance = range?.max ?? 100; // Default max distance 100 km

    const rangePips = useMemo(() => {
      const totalPips = 15;
      return Array.from({ length: totalPips }, (_, i) => {
        const pipValue = (i / (totalPips - 1)) * maxDistance;
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
    }, [value, maxDistance]);

    const onInputValueChange = useCallback(
      (inputValue: string) => {
        const newValue = Number(inputValue);
        if (!Number.isNaN(newValue)) {
          setValue(clampValue(newValue, 0, maxDistance));
        }
      },
      [maxDistance],
    );

    return (
      <div className={cn('flex flex-col gap-3', className)}>
        <div className="flex flex-col gap-1">
          <div className="flex h-12 w-full items-end justify-between px-2">{rangePips}</div>
          <Slider
            {...props}
            ref={ref}
            minValue={0}
            maxValue={maxDistance}
            step={range?.step || 1}
            value={value}
            onChange={(val) => setValue(val as number)}
            size="sm"
          />
        </div>
        <div className="w-24 text-sm">
          <Input
            aria-label="Distance"
            labelPlacement="inside"
            type="number"
            startContent={<p className="text-default-500 text-sm">km</p>}
            value={`${value}`}
            onValueChange={onInputValueChange}
          />
        </div>
      </div>
    );
  },
);

DistanceSlider.displayName = 'DistanceSlider';

export default DistanceSlider;

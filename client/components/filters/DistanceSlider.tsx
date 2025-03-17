'use client';

import type { RangeFilter, RangeValue } from '@/components/utils/filtersTypes';
import type { SliderProps } from '@heroui/react';

import { Input, Slider, cn } from '@heroui/react';
import React from 'react';

export type DistanceSliderProps = Omit<SliderProps, 'ref'> & {
  range?: RangeFilter;
  animation?: 'opacity' | 'height';
};

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function scaleValue(value: number, fromRange: RangeValue, toRange: RangeValue = [0, 100]) {
  const [fromMin, fromMax] = fromRange;
  const [toMin, toMax] = toRange;
  const scale = (toMax - toMin) / (fromMax - fromMin);
  return (value - fromMin) * scale + toMin;
}

const DistanceSliderPip: React.FC<{ index: number; totalPips: number; isInRange: boolean }> = ({
  index,
  totalPips,
  isInRange,
}) => {
  // Linearly scale the pip height from 30% to 100% based on position
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
    const [value, setValue] = React.useState<number>(defaultValue);

    const maxDistance = range?.max ?? 100; // Default max distance 100 km

    const rangePips = React.useMemo(() => {
      const totalPips = 15; // Number of pips to display
      return Array.from({ length: totalPips }, (_, i) => {
        const pipValue = (i / (totalPips - 1)) * maxDistance; // Scale pips along the range
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

    const onInputValueChange = (inputValue: string) => {
      const newValue = Number(inputValue);
      if (!Number.isNaN(newValue)) {
        setValue(clampValue(newValue, 0, maxDistance));
      }
    };

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
            onChange={(value) => setValue(value as number)}
            size="sm"
          />
        </div>
        <div className="w-24 text-sm ">
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

import type { PopoverProps } from '@heroui/react';
import type { CheckboxProps } from '@heroui/react';
import type { RadioProps } from '@heroui/react';
import type { SliderProps } from '@heroui/react';

export enum FilterTypeEnum {
  Tabs = 'tabs',
  DistanceRange = 'distance_range',
  Rating = 'rating',
  TagGroup = 'tag_group',
  CheckboxGroup = 'checkbox_group',
  Toggle = 'toggle',
  Color = 'color',
}

export type RangeValue = [number, number];

export type RangeFilter = {
  min: number;
  max: number;
  step: number;
  defaultValue: RangeValue;
};

export type Filter = {
  key: string;
  type: FilterTypeEnum;
  title: string;
  description?: string;
  range?: RangeFilter;
  defaultOpen?: boolean;
  options?: Array<{
    title: string;
    value: string;
    description?: string;
    icon?: string;
    color?: string;
  }>;
};

export type PopoverFilterWrapperProps = Omit<PopoverProps, 'children'> & {
  title?: string;
  children: React.ReactNode;
  onApply?: () => void;
  onCancel?: () => void;
};

export type TagGroupItemProps = Omit<CheckboxProps, 'icon'> & {
  icon?: string;
};

export type ColorRadioItemProps = Omit<RadioProps, 'color'> & { color?: string; tooltip?: string };

export type DistanceSliderProps = {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  animation?: 'opacity' | 'height';
  className?: string;
};

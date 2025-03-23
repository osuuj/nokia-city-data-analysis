import type { CheckboxProps, PopoverProps, RadioProps } from '@heroui/react';

/**
 * Enum representing all supported filter types in the UI.
 */
export enum FilterTypeEnum {
  Tabs = 'tabs',
  DistanceRange = 'distance_range',
  Rating = 'rating',
  TagGroup = 'tag_group',
  CheckboxGroup = 'checkbox_group',
  Toggle = 'toggle',
  Color = 'color',
}

/**
 * A tuple of two numbers representing a min-max range value.
 */
export type RangeValue = [number, number];

/**
 * Describes a slider or range-based filter (e.g. distance or rating).
 */
export type RangeFilter = {
  min: number;
  max: number;
  step: number;
  defaultValue: RangeValue;
};

/**
 * Generic filter structure used to render dynamic filter UIs.
 */
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

/**
 * Props passed to the PopoverFilterWrapper component used for filters.
 */
export type PopoverFilterWrapperProps = Omit<PopoverProps, 'children'> & {
  title?: string;
  children: React.ReactNode;
  onApply?: () => void;
  onCancel?: () => void;
};

/**
 * Props for a single tag-style checkbox filter item.
 */
export type TagGroupItemProps = Omit<CheckboxProps, 'icon'> & {
  icon?: string;
};

/**
 * Props for a color option in a radio group (like selecting a color theme).
 */
export type ColorRadioItemProps = Omit<RadioProps, 'color'> & {
  color?: string;
  tooltip?: string;
};

/**
 * Props for the DistanceSlider component.
 */
export type DistanceSliderProps = {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  animation?: 'opacity' | 'height';
  className?: string;
};

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

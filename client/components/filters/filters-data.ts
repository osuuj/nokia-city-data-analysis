import type { Filter } from '@/components/filters/filters-types';
import { FilterTypeEnum } from '@/components/filters/filters-types';

export const filters: Filter[] = [
  {
    key: 'industry',
    title: 'Industry',
    type: FilterTypeEnum.CheckboxGroup, // ✅ Use Enum instead of string
    options: [
      { value: 'tech', title: 'Tech' },
      { value: 'finance', title: 'Finance' },
      { value: 'healthcare', title: 'Healthcare' },
    ],
  },
  {
    key: 'distance',
    title: 'Maximum distance',
    type: FilterTypeEnum.PriceRange, // ✅ Use Enum instead of string
    range: {
      min: 0,
      max: 150,
      step: 5,
      defaultValue: [0, 900],
    },
  },
  {
    key: 'rating',
    title: 'Rating',
    type: FilterTypeEnum.Rating, // ✅ Use Enum instead of string
  },
];

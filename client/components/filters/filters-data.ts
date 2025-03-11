import type { Filter } from '@/components/filters/filters-types';
import { FilterTypeEnum } from '@/components/filters/filters-types';

export const filters: Filter[] = [
  {
    key: 'category',
    title: 'Category',
    type: FilterTypeEnum.CheckboxGroup, // ✅ Use Enum instead of string
    options: [
      { value: 'tech', title: 'Tech' },
      { value: 'finance', title: 'Finance' },
      { value: 'healthcare', title: 'Healthcare' },
    ],
  },
  {
    key: 'price',
    title: 'Price Range',
    type: FilterTypeEnum.PriceRange, // ✅ Use Enum instead of string
    range: {
      min: 0,
      max: 1000,
      step: 10,
      defaultValue: [100, 900],
    },
  },
  {
    key: 'rating',
    title: 'Rating',
    type: FilterTypeEnum.Rating, // ✅ Use Enum instead of string
  },
];

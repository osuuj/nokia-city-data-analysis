import type { Filter } from '@/components/filters/filters-types';
import { FilterTypeEnum } from '@/components/filters/filters-types';

export const filters: Filter[] = [
  {
    key: 'filtersOptions',
    title: 'Choose filter options',
    type: FilterTypeEnum.Toggle,
    options: [
      {
        title: 'Share location',
        description: "Share user's location to use distance filter",
        value: 'userLocation',
      },
      {
        title: 'Number of companies',
        description: 'Choose the number of companies',
        value: 'companiesCount',
      },
    ],
  },
  {
    key: 'industries',
    title: 'Industries',
    description: 'Select as many as you want',
    type: FilterTypeEnum.TagGroup,
    options: [
      {
        title: 'Agriculture & Fishing',
        value: 'A',
        icon: 'solar:leaf-bold',
      },
      {
        title: 'Mining & Quarrying',
        value: 'B',
        icon: 'solar:pie-chart-2-bold',
      },
      {
        title: 'Manufacturing',
        value: 'C',
        icon: 'solar:buildings-2-bold',
      },
      {
        title: 'Energy Supply',
        value: 'D',
        icon: 'solar:bolt-bold',
      },
      {
        title: 'Water & Waste Management',
        value: 'E',
        icon: 'solar:waterdrops-bold',
      },
      {
        title: 'Construction',
        value: 'F',
        icon: 'solar:sledgehammer-bold',
      },
      {
        title: 'Wholesale & Retail',
        value: 'G',
        icon: 'solar:cart-large-bold',
      },
      {
        title: 'Transport & Storage',
        value: 'H',
        icon: 'solar:box-bold',
      },
      {
        title: 'Hospitality & Food Services',
        value: 'I',
        icon: 'solar:chef-hat-bold',
      },
      {
        title: 'Media & Publishing',
        value: 'J',
        icon: 'solar:station-bold',
      },
      {
        title: 'IT & Telecommunications',
        value: 'K',
        icon: 'solar:cpu-bolt-bold',
      },
      {
        title: 'Finance & Insurance',
        value: 'L',
        icon: 'solar:money-bag-bold',
      },
      {
        title: 'Real Estate',
        value: 'M',
        icon: 'solar:home-bold',
      },
      {
        title: 'Science & Professional Services',
        value: 'N',
        icon: 'solar:rocket-2-bold',
      },
      {
        title: 'Admin & Support Services',
        value: 'O',
        icon: 'solar:clipboard-bold',
      },
      {
        title: 'Government & Defence',
        value: 'P',
        icon: 'solar:incognito-bold',
      },
      {
        title: 'Education',
        value: 'Q',
        icon: 'solar:square-academic-cap-2-bold',
      },
      {
        title: 'Healthcare & Social Work',
        value: 'R',
        icon: 'solar:hospital-bold',
      },
      {
        title: 'Arts & Recreation',
        value: 'S',
        icon: 'solar:pallete-2-bold',
      },
      {
        title: 'Other Services',
        value: 'T',
        icon: 'solar:paint-roller-bold',
      },
      {
        title: 'Household Services',
        value: 'U',
        icon: 'solar:people-nearby-bold',
      },
      {
        title: 'International Organizations',
        value: 'V',
        icon: 'solar:globus-bold',
      },
    ],
  },
];

import { type Filter, FilterTypeEnum } from '@/types';

/**
 * @constant filters
 *
 * UI filter configuration array explicitly used across the application.
 * Provides structured metadata explicitly for filter rendering.
 *
 * @type {Filter[]}
 */
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
    ],
  },
  {
    key: 'industries',
    title: 'Industries',
    description: 'Select as many as you want',
    type: FilterTypeEnum.CheckboxGroup,
    options: [
      {
        title: 'Agriculture & Fishing',
        value: 'A',
        icon: 'solar:leaf-bold',
        color: '#17C964',
      },
      {
        title: 'Mining & Quarrying',
        value: 'B',
        icon: 'solar:pie-chart-2-bold',
        color: '#936316',
      },
      {
        title: 'Manufacturing',
        value: 'C',
        icon: 'solar:buildings-2-bold',
        color: '#71717A',
      },
      {
        title: 'Energy Supply',
        value: 'D',
        icon: 'solar:bolt-bold',
        color: '#F7B750',
      },
      {
        title: 'Water & Waste Management',
        value: 'E',
        icon: 'solar:waterdrops-bold',
        color: '#006FEE',
      },
      {
        title: 'Construction',
        value: 'F',
        icon: 'solar:sledgehammer-bold',
        color: '#62420E',
      },
      {
        title: 'Wholesale & Retail',
        value: 'G',
        icon: 'solar:cart-large-bold',
        color: '#7828c8',
      },
      {
        title: 'Transport & Storage',
        value: 'H',
        icon: 'solar:box-bold',
        color: '#f5a524',
      },
      {
        title: 'Hospitality & Food Services',
        value: 'I',
        icon: 'solar:chef-hat-bold',
        color: '#f5a524',
      },
      {
        title: 'Media & Publishing',
        value: 'J',
        icon: 'solar:station-bold',
        color: '#06B7DB',
      },
      {
        title: 'IT & Telecommunications',
        value: 'K',
        icon: 'solar:cpu-bolt-bold',
        color: '#002E62',
      },
      {
        title: 'Finance & Insurance',
        value: 'L',
        icon: 'solar:money-bag-bold',
        color: '#45D483',
      },
      {
        title: 'Real Estate',
        value: 'M',
        icon: 'solar:home-bold',
        color: '#F54180',
      },
      {
        title: 'Science & Professional Services',
        value: 'N',
        icon: 'solar:rocket-2-bold',
        color: '#F31260',
      },
      {
        title: 'Admin & Support Services',
        value: 'O',
        icon: 'solar:clipboard-bold',
        color: '#F9C97C',
      },
      {
        title: 'Government & Defence',
        value: 'P',
        icon: 'solar:incognito-bold',
        color: '#6020A0',
      },
      {
        title: 'Education',
        value: 'Q',
        icon: 'solar:square-academic-cap-2-bold',
        color: '#66AAF9',
      },
      {
        title: 'Healthcare & Social Work',
        value: 'R',
        icon: 'solar:hospital-bold',
        color: '#992F7B',
      },
      {
        title: 'Arts & Recreation',
        value: 'S',
        icon: 'solar:pallete-2-bold',
        color: '#09AACD',
      },
      {
        title: 'Other Services',
        value: 'T',
        icon: 'solar:paint-roller-bold',
        color: '#C4841D',
      },
      {
        title: 'Household Services',
        value: 'U',
        icon: 'solar:people-nearby-bold',
        color: '#7828c8',
      },
      {
        title: 'International Organizations',
        value: 'V',
        icon: 'solar:globus-bold',
        color: '#005bc4',
      },
    ],
  },
];

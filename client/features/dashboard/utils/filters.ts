import { type Filter, FilterTypeEnum } from '@/features/dashboard/types/filters';

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
        color: { light: '#FBBF24', dark: '#FFD700' },
      },
      {
        title: 'Mining & Quarrying',
        value: 'B',
        icon: 'solar:pie-chart-2-bold',
        color: { light: '#10B981', dark: '#00FF7F' },
      },
      {
        title: 'Manufacturing',
        value: 'C',
        icon: 'solar:buildings-2-bold',
        color: { light: '#3B82F6', dark: '#00CED1' },
      },
      {
        title: 'Energy Supply',
        value: 'D',
        icon: 'solar:bolt-bold',
        color: { light: '#EF4444', dark: '#FF6347' },
      },
      {
        title: 'Water & Waste Management',
        value: 'E',
        icon: 'solar:waterdrops-bold',
        color: { light: '#8B5CF6', dark: '#DA70D6' },
      },
      {
        title: 'Construction',
        value: 'F',
        icon: 'solar:sledgehammer-bold',
        color: { light: '#EC4899', dark: '#FF69B4' },
      },
      {
        title: 'Wholesale & Retail',
        value: 'G',
        icon: 'solar:cart-large-bold',
        color: { light: '#22D3EE', dark: '#40E0D0' },
      },
      {
        title: 'Transport & Storage',
        value: 'H',
        icon: 'solar:box-bold',
        color: { light: '#F97316', dark: '#FF8C00' },
      },
      {
        title: 'Hospitality & Food Services',
        value: 'I',
        icon: 'solar:chef-hat-bold',
        color: { light: '#52525B', dark: '#ADFF2F' },
      },
      {
        title: 'Media & Publishing',
        value: 'J',
        icon: 'solar:station-bold',
        color: { light: '#14B8A6', dark: '#20B2AA' },
      },
      {
        title: 'IT & Telecommunications',
        value: 'K',
        icon: 'solar:cpu-bolt-bold',
        color: { light: '#6366F1', dark: '#7B68EE' },
      },
      {
        title: 'Finance & Insurance',
        value: 'L',
        icon: 'solar:money-bag-bold',
        color: { light: '#D946EF', dark: '#DDA0DD' },
      },
      {
        title: 'Real Estate',
        value: 'M',
        icon: 'solar:home-bold',
        color: { light: '#F59E0B', dark: '#FFA500' },
      },
      {
        title: 'Science & Professional Services',
        value: 'N',
        icon: 'solar:rocket-2-bold',
        color: { light: '#0EA5E9', dark: '#1E90FF' },
      },
      {
        title: 'Admin & Support Services',
        value: 'O',
        icon: 'solar:clipboard-bold',
        color: { light: '#E11D48', dark: '#DC143C' },
      },
      {
        title: 'Government & Defence',
        value: 'P',
        icon: 'solar:incognito-bold',
        color: { light: '#52525B', dark: '#BA55D3' },
      },
      {
        title: 'Education',
        value: 'Q',
        icon: 'solar:square-academic-cap-2-bold',
        color: { light: '#B91C1C', dark: '#FF4500' },
      },
      {
        title: 'Healthcare & Social Work',
        value: 'R',
        icon: 'solar:hospital-bold',
        color: { light: '#6EE7B7', dark: '#5F9EA0' },
      },
      {
        title: 'Arts & Recreation',
        value: 'S',
        icon: 'solar:pallete-2-bold',
        color: { light: '#7C3AED', dark: '#8A2BE2' },
      },
      {
        title: 'Other Services',
        value: 'T',
        icon: 'solar:paint-roller-bold',
        color: { light: '#52525B', dark: '#FFDE59' },
      },
      {
        title: 'Household Services',
        value: 'U',
        icon: 'solar:people-nearby-bold',
        color: { light: '#4ADE80', dark: '#32CD32' },
      },
      {
        title: 'International Organizations',
        value: 'V',
        icon: 'solar:globus-bold',
        color: { light: '#60A5FA', dark: '#4682B4' },
      },
    ],
  },
];

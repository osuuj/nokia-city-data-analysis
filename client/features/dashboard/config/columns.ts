import type { TableColumnConfig } from '@/features/dashboard/types/table';

/**
 * Table column configuration
 */
export const columns: TableColumnConfig[] = [
  {
    key: 'business_id',
    label: 'Business ID',
    visible: true,
    userVisible: true,
  },
  {
    key: 'company_name',
    label: 'Company Name',
    visible: true,
    userVisible: true,
  },
  {
    key: 'registration_date',
    label: 'Registration Date',
    visible: true,
    userVisible: true,
  },
  {
    key: 'industry_letter',
    label: 'Industry Code',
    visible: true,
    userVisible: true,
  },
  {
    key: 'industry_description',
    label: 'Industry',
    visible: true,
    userVisible: true,
  },
  {
    key: 'main_business_line',
    label: 'Business Line Code',
    visible: false,
    userVisible: true,
  },
  {
    key: 'main_business_line_name',
    label: 'Business Line',
    visible: true,
    userVisible: true,
  },
  {
    key: 'street',
    label: 'Street',
    visible: true,
    userVisible: true,
  },
  {
    key: 'postal_code',
    label: 'Postal Code',
    visible: true,
    userVisible: true,
  },
  {
    key: 'city',
    label: 'City',
    visible: true,
    userVisible: true,
  },
  {
    key: 'active',
    label: 'Active',
    visible: true,
    userVisible: true,
  },
];

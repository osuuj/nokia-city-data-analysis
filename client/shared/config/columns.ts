import type { TableColumnConfig } from '@/features/dashboard/types';

export const columns: TableColumnConfig[] = [
  { key: 'business_id', label: 'Business ID', visible: true, userVisible: true },
  { key: 'company_name', label: 'Company Name', visible: true, userVisible: true },

  // 🏡 Derived from Visiting address
  { key: 'street', label: 'Street', visible: false, userVisible: false },
  { key: 'building_number', label: 'Building Number', visible: false, userVisible: false },
  { key: 'entrance', label: 'Entrance', visible: false, userVisible: false },
  { key: 'postal_code', label: 'Postal Code', visible: false, userVisible: false },
  { key: 'city', label: 'City', visible: false, userVisible: false },
  { key: 'address_type', label: 'Address Type', visible: false, userVisible: false },

  // 🏭 Company metadata
  { key: 'company_type', label: 'Company Type', visible: false, userVisible: false },
  { key: 'industry', label: 'Industry', visible: true, userVisible: true },
  {
    key: 'industry_description',
    label: 'Industry Description',
    visible: false,
    userVisible: false,
  },
  { key: 'industry_letter', label: 'Industry Letter', visible: false, userVisible: false },
  { key: 'registration_date', label: 'Registration Date', visible: true, userVisible: true },
  { key: 'active', label: 'Active', visible: true, userVisible: true },
  { key: 'website', label: 'Website', visible: false, userVisible: false },
];

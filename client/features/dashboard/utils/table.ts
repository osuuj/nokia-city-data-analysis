import type { CompanyProperties } from '@/features/dashboard/types/business';
import type {
  CompanyTableKey,
  DirectCompanyKey,
  SortDescriptor,
  TableColumnConfig,
} from '@/features/dashboard/types/table';

/**
 * @function getVisibleColumns
 * Returns only the visible columns based on the visible property
 */
export function getVisibleColumns(columns: TableColumnConfig[]): TableColumnConfig[] {
  return columns.filter((column) => column.visible);
}

/**
 * @function sortCompanies
 * Sorts companies by the specified column and direction
 */
export const sortCompanies = (
  data: CompanyProperties[],
  descriptor: SortDescriptor,
  addressType: 'Visiting address' | 'Postal address' = 'Visiting address',
): CompanyProperties[] => {
  const { column, direction } = descriptor;

  return [...data].sort((a, b) => {
    const getValue = (item: CompanyProperties) => {
      const address = item.addresses?.[addressType];

      switch (column) {
        case 'street':
          return address?.street ?? '';
        case 'building_number':
          return address?.building_number ?? '';
        case 'entrance':
          return address?.entrance ?? '';
        case 'postal_code':
          return address?.postal_code ?? '';
        case 'city':
          return address?.city ?? '';
        case 'address_type':
          return addressType;
        case 'active':
          return item.active ? 'Yes' : 'No';
        default:
          return (item[column as keyof CompanyProperties] as string | undefined) ?? '';
      }
    };

    const aVal = getValue(a);
    const bVal = getValue(b);

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * @function applySearchFilter
 * Filters companies by name containing the search term
 */
export const applySearchFilter = (
  data: CompanyProperties[],
  searchTerm: string,
): CompanyProperties[] => {
  const term = searchTerm.toLowerCase();
  return data.filter((item) => item.company_name.toLowerCase().includes(term));
};

/**
 * @function applyIndustryFilter
 * Filters companies by matching industry letters
 */
export const applyIndustryFilter = (
  data: CompanyProperties[],
  selectedIndustries: string[],
): CompanyProperties[] => {
  if (selectedIndustries.length === 0) return data;
  return data.filter((item) => {
    // Handle the case where industry_letter might be undefined
    const industry = item.industry_letter || '';
    return selectedIndustries.includes(industry);
  });
};

/**
 * @function getCellValue
 * Get the display value for a cell based on its column key and address type
 */
export function getCellValue(
  item: CompanyProperties,
  columnKey: CompanyTableKey,
  addressType: 'Visiting address' | 'Postal address' = 'Visiting address',
): string {
  const address = item.addresses?.[addressType];

  switch (columnKey) {
    case 'street':
      return address?.street ?? '';
    case 'building_number':
      return address?.building_number ?? '';
    case 'entrance':
      return address?.entrance ?? '';
    case 'postal_code':
      return address?.postal_code ?? '';
    case 'city':
      return address?.city ?? '';
    case 'address_type':
      return addressType;
    case 'active':
      return item.active ? 'Yes' : 'No';
    default:
      return (item[columnKey as keyof CompanyProperties] as string | undefined) ?? '';
  }
}

import type { CompanyProperties } from '../types';
import type { CompanyTableKey, SortDescriptor, TableColumnConfig } from '../types/table';

/**
 * @function getVisibleColumns
 */
export const getVisibleColumns = (columns: TableColumnConfig[]): TableColumnConfig[] => {
  return columns.filter((column) => column.visible);
};

/**
 * @function sortCompanies
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
 */
export const applyIndustryFilter = (
  data: CompanyProperties[],
  selectedIndustries: string[],
): CompanyProperties[] => {
  if (selectedIndustries.length === 0) return data;
  return data.filter((item) => selectedIndustries.includes(item.industry_letter));
};

/**
 * @function getCellValue
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

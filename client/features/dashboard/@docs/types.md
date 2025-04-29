# Dashboard Types

This document provides information about the TypeScript types used in the Dashboard feature.

## Business Types

### CompanyProperties

Core type representing a business entity.

```typescript
export interface CompanyProperties {
  business_id: string;
  company_name: string;
  industry: string;
  industry_letter: string;
  addresses?: {
    'Visiting address'?: AddressData;
    'Postal address'?: AddressData;
  };
  // Additional properties
}
```

### AddressData

Type representing address data with geographic coordinates.

```typescript
export interface AddressData {
  street: string;
  city: string;
  post_code: string;
  latitude: number;
  longitude: number;
}
```

## View Types

### ViewMode

Type representing the different view modes available in the dashboard.

```typescript
export type ViewMode = 'table' | 'map' | 'split' | 'analytics';
```

### ViewSwitcherProps

Props for the ViewSwitcher component.

```typescript
export interface ViewSwitcherProps extends Omit<TableViewProps, 'data'> {
  data: CompanyProperties[];
  allFilteredData: CompanyProperties[];
  geojson?: FeatureCollection<Point, CompanyProperties>;
  viewMode: ViewMode;
  selectedBusinesses: CompanyProperties[];
  setViewMode: (mode: ViewMode) => void;
}
```

## Table Types

### TableColumnConfig

Configuration for table columns.

```typescript
export interface TableColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  userVisible?: boolean;
  width?: string | number;
  sortable?: boolean;
  renderCell?: (item: CompanyProperties) => React.ReactNode;
}
```

### TableViewProps

Props for the TableView component.

```typescript
export interface TableViewProps {
  data: CompanyProperties[];
  columns: TableColumnConfig[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
}
```

### SortDescriptor

Type for describing how table data should be sorted.

```typescript
export interface SortDescriptor {
  column: string;
  direction: 'ascending' | 'descending';
}
```

## Analytics Types

### AnalyticsData

Represents analytics data with ID, name, value, and timestamp.

```typescript
export interface AnalyticsData {
  id: string;
  name: string;
  value: number;
  timestamp: string;
}
```

### TopCityData

Data for a top city in terms of business metrics.

```typescript
export interface TopCityData {
  city: string;
  count: number;
  companyCount: number;
  industryCount: number;
  averageCompaniesPerIndustry: number;
}
```

### DistributionItemRaw

A raw distribution item with name and value.

```typescript
export interface DistributionItemRaw {
  name: string;
  value: number;
  others_breakdown?: Array<{ name: string; value: number }>;
}
```

### TransformedDistribution

A transformed distribution item with industry name, count, and percentage.

```typescript
export interface TransformedDistribution {
  industry: string;
  count: number;
  percentage: number;
}
```

## Filter Types

### FilterOption

Represents a filter option.

```typescript
export interface FilterOption {
  value: string;
  title: string;
  icon?: string;
  color?: string;
}
```

### FilterGroupProps

Props for the FilterGroup component.

```typescript
export interface FilterGroupProps {
  useLocation: boolean;
  setUseLocation: (useLocation: boolean) => void;
  setAddress: (address: string) => void;
}
```

### DistanceSliderProps

Props for the DistanceSlider component.

```typescript
export interface DistanceSliderProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  tooltipContent?: string;
}
```

## Store Types

### CompanyState

State managed by the company store.

```typescript
export interface CompanyState {
  selectedCity: string;
  selectedIndustries: string[];
  distanceLimit: number | null;
  userLocation: { latitude: number; longitude: number } | null;
  setSelectedCity: (city: string) => void;
  setSelectedIndustries: (industries: string[]) => void;
  setDistanceLimit: (limit: number | null) => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
}
```

### SelectionState

State managed by the selection store.

```typescript
export interface SelectionState {
  selectedRows: Record<string, CompanyProperties>;
  selectedKeys: Set<string>;
  setSelectedKeys: (keys: Set<string> | 'all', allFilteredData?: CompanyProperties[]) => void;
  toggleRow: (business: CompanyProperties) => void;
  clearSelection: () => void;
  isMultiSelectMode: boolean;
  toggleMultiSelectMode: () => void;
  lastSelectedKey: string | null;
  setLastSelectedKey: (key: string | null) => void;
}
```

## Error Types

### DashboardError

Type for dashboard-specific errors.

```typescript
export interface DashboardError {
  message: string;
  code?: string;
  status?: number;
}
```

### ErrorWithApi

Error type combining standard Error and API error properties.

```typescript
export interface ErrorWithApi {
  name: string;
  message: string;
  status: number;
  code?: string;
}
```

## Best Practices

1. Use TypeScript interfaces for complex objects
2. Prefer type aliases for union types
3. Use descriptive property names
4. Include JSDoc comments on interfaces and types
5. Export types from a central location for better organization
6. Consider using utility types (Partial, Pick, Omit) to create derived types 
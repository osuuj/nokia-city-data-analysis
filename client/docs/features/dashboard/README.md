# Dashboard Feature

The Dashboard feature provides data visualization and exploration capabilities for city-based business data, with multiple views including map, table, and analytics charts.

## Overview

- **Multiple View Modes**: Toggle between map view, table view, and analytics view
- **Interactive Map**: Geospatial visualization with markers and info windows
- **Data Table**: Filterable, sortable data table with pagination
- **Analytics Charts**: Visual analytics with charts and comparisons
- **City Search**: Search and filter data by city and distance
- **Loading States**: Optimized loading experiences with skeletons
- **Error Handling**: Graceful error recovery with boundary components

## Directory Structure

```
client/features/dashboard/
├── components/                    # UI components
│   ├── common/                    # Shared dashboard components
│   │   ├── CitySearch/            # City search functionality
│   │   │   ├── Autocomplete.tsx   # Autocomplete component
│   │   │   └── CitySearch.tsx     # Main search component
│   │   ├── loading/               # Loading components
│   │   │   ├── DashboardLoadingState.tsx  # Full dashboard loading
│   │   │   ├── DataLoader.tsx     # Data loading wrapper
│   │   │   ├── Preloader.tsx      # Assets preloader
│   │   │   └── SectionLoader.tsx  # Section-specific loading
│   │   ├── Animations.tsx         # Animation components
│   │   ├── BaseCard.tsx           # Card component base
│   │   ├── DashboardPage.tsx      # Dashboard page wrapper
│   │   ├── DataFetchError.tsx     # Error display component
│   │   └── ErrorBoundaryWrappers.tsx # Error boundaries
│   ├── controls/                  # UI controls
│   │   ├── Toggles/               # Toggle components
│   │   │   ├── ViewModeToggle.tsx # Mode toggle component
│   │   │   └── ViewSwitcher.tsx   # View switching component
│   │   ├── DashboardHeader.tsx    # Dashboard header
│   │   └── PaginationControls.tsx # Pagination UI
│   ├── layout/                    # Layout components
│   │   ├── sidebar/               # Sidebar components
│   │   │   ├── Sidebar.tsx        # Main sidebar component
│   │   │   ├── SidebarItems.tsx   # Sidebar navigation items
│   │   │   └── SidebarWrapper.tsx # Sidebar wrapper
│   │   └── DashboardFooter.tsx    # Dashboard footer
│   ├── lazy/                      # Lazy-loaded components
│   │   └── LazyComponentWrapper.tsx # Lazy loading wrapper
│   └── views/                     # Main view components
│       ├── AnalyticsView/         # Analytics dashboard
│       │   ├── cards/             # Chart components
│       │   │   ├── ChartSkeleton.tsx     # Loading skeleton
│       │   │   ├── CityComparison.tsx    # City comparison chart
│       │   │   ├── CityIndustryBars.tsx  # Industry bars chart
│       │   │   ├── IndustryDistribution.tsx # Distribution chart
│       │   │   └── TopCitiesChart.tsx    # Top cities chart
│       │   ├── AnalyticsDashboardLoadingState.tsx # Loading state
│       │   └── AnalyticsView.tsx   # Main analytics view
│       ├── MapView/                # Map visualization
│       │   ├── FeatureCardList.tsx # Feature cards for map
│       │   ├── MapView.tsx         # Main map view
│       │   └── ThemeAwareMapWrapper.tsx # Map with theme support
│       └── TableView/              # Table view
│           ├── toolbar/            # Table toolbar components
│           │   ├── ColumnVisibilityDropdown.tsx # Column toggle
│           │   ├── DistanceSlider.tsx    # Distance filter slider
│           │   ├── FilterGroup.tsx       # Filter group component
│           │   ├── FilterTag.tsx         # Filter tag component
│           │   ├── PopoverFilterWrapper.tsx # Popover wrapper
│           │   ├── SearchInput.tsx       # Search input component
│           │   ├── SortDropdown.tsx      # Sort controls
│           │   ├── TableToolbar.tsx      # Main toolbar
│           │   └── TagGroupItem.tsx      # Tag group component
│           ├── TableView.tsx       # Main table view
│           └── VirtualizedTable.tsx # Virtualized table
├── config/                         # Configuration
│   └── columns.ts                  # Table column configuration
├── hooks/                          # Custom React hooks
│   ├── useChartTheme.ts            # Chart theming hook
│   ├── useCitySearch.ts            # City search hook
│   ├── useCitySelection.ts         # City selection hook
│   ├── useCompaniesQuery.ts        # Data fetching hook
│   ├── useDashboardLoading.ts      # Loading state hook
│   ├── useDashboardPagination.ts   # Pagination hook
│   ├── useFilteredBusinesses.ts    # Data filtering hook
│   ├── useMapTheme.ts              # Map theming hook
│   └── usePagination.ts            # Pagination logic hook
├── providers/                      # Context providers
│   └── ...                         # Provider components
├── store/                          # State management
│   └── useCompanyStore.ts          # Company data store
├── types/                          # TypeScript types
│   ├── business.ts                 # Business data types
│   ├── companyStore.ts             # Store types
│   ├── error.ts                    # Error types
│   ├── filters.ts                  # Filter types
│   ├── table.ts                    # Table types
│   └── view.ts                     # View types
├── utils/                          # Utility functions
│   ├── errorReporting.ts           # Error handling utilities
│   ├── filters.ts                  # Filter utilities
│   ├── geo.ts                      # Geospatial utilities
│   ├── lazyLoading.ts              # Lazy loading utilities
│   └── table.ts                    # Table utilities
└── index.ts                        # Feature exports
```

## Key Components

### View Components

- **AnalyticsView**: Data visualization with charts and metrics
- **MapView**: Geospatial visualization with interactive map
- **TableView**: Tabular data view with filtering and sorting
- **ViewSwitcher**: Component to switch between different views

### Common Components

- **CitySearch**: City search with autocomplete functionality
- **BaseCard**: Card component used throughout the dashboard
- **DashboardPage**: Page wrapper with layout structure
- **ErrorBoundaryWrappers**: Error boundaries for different sections

### Loading Components

- **DashboardLoadingState**: Overall dashboard loading skeleton
- **DataLoader**: Data loading wrapper with error handling
- **SectionLoader**: Section-specific loading states
- **ChartSkeleton**: Skeleton for chart components

## Component Hierarchy

```
DashboardPage
├── ErrorBoundaryWrappers
│   ├── DashboardHeader
│   │   └── CitySearch
│   ├── SidebarWrapper
│   │   └── Sidebar
│   │       └── SidebarItems
│   ├── ViewSwitcher
│   │   └── ViewModeToggle
│   └── {CurrentView}
│       ├── AnalyticsView
│       │   ├── CityIndustryBars
│       │   ├── IndustryDistribution
│       │   ├── TopCitiesChart
│       │   └── CityComparison
│       ├── MapView
│       │   ├── ThemeAwareMapWrapper
│       │   └── FeatureCardList
│       └── TableView
│           ├── TableToolbar
│           │   ├── SearchInput
│           │   ├── FilterGroup
│           │   ├── SortDropdown
│           │   └── ColumnVisibilityDropdown
│           ├── VirtualizedTable
│           └── PaginationControls
└── DashboardFooter
```

## Shared Component Usage

The Dashboard feature leverages several shared components:

```tsx
// Background and theme
import { TransitionBackground } from '@/shared/components/ui/background';
import { gradientColors } from '@/shared/utils/backgroundConfig';

// Loading components
import { CardSkeleton, TableSkeleton } from '@/shared/components/loading';

// Error handling
import { ErrorDisplay } from '@/shared/components/error';

// UI components
import { Button, Select, Dropdown } from '@/shared/components/ui';
```

## Data Management

The Dashboard feature uses a combination of React Query for data fetching and Zustand for state management:

```tsx
// Data fetching with React Query
import { useCompaniesQuery } from '@/features/dashboard/hooks/useCompaniesQuery';

function CompanyList() {
  const { 
    data,
    isLoading, 
    error,
    refetch
  } = useCompaniesQuery({
    city: 'Helsinki',
    distance: 5
  });
  
  // Component implementation
}

// State management with Zustand
import { useCompanyStore } from '@/features/dashboard/store/useCompanyStore';

function FilteredCompanies() {
  const { 
    companies,
    filteredCompanies,
    setFilter,
    clearFilters
  } = useCompanyStore();
  
  // Component implementation
}
```

## Core Types

```typescript
// Business data types
export interface Company {
  id: string;
  name: string;
  businessId: string;
  address: string;
  postalCode: string;
  city: string;
  industry: string;
  subIndustry?: string;
  location: {
    lat: number;
    lng: number;
  };
  foundedYear?: number;
  size?: CompanySize;
}

export enum CompanySize {
  Micro = 'micro',
  Small = 'small',
  Medium = 'medium',
  Large = 'large'
}

// View types
export enum ViewMode {
  Table = 'table',
  Map = 'map',
  Analytics = 'analytics'
}

// Filter types
export interface FilterState {
  city?: string;
  distance?: number;
  industry?: string[];
  companySize?: CompanySize[];
  searchTerm?: string;
}
```

## Usage Examples

### Dashboard with View Switching

```tsx
import { DashboardPage, ViewSwitcher } from '@/features/dashboard/components';
import { useState } from 'react';
import { ViewMode } from '@/features/dashboard/types';

function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.Table);
  
  return (
    <DashboardPage>
      <ViewSwitcher 
        currentView={currentView}
        onChange={setCurrentView}
      />
      
      {/* Current view content */}
    </DashboardPage>
  );
}
```

### City Search with Filtering

```tsx
import { CitySearch } from '@/features/dashboard/components/common/CitySearch';
import { useCitySelection } from '@/features/dashboard/hooks';

function CityFilter() {
  const { selectedCity, setSelectedCity, distance, setDistance } = useCitySelection();
  
  return (
    <div>
      <CitySearch
        value={selectedCity}
        onChange={setSelectedCity}
        distance={distance}
        onDistanceChange={setDistance}
      />
    </div>
  );
}
```

### Analytics Chart Usage

```tsx
import { CityIndustryBars } from '@/features/dashboard/components/views/AnalyticsView/cards';
import { useFilteredBusinesses } from '@/features/dashboard/hooks';

function IndustryAnalytics() {
  const { businesses, isLoading } = useFilteredBusinesses();
  
  if (isLoading) {
    return <ChartSkeleton />;
  }
  
  return (
    <CityIndustryBars 
      data={businesses}
      title="Industry Distribution"
    />
  );
}
```

## Best Practices

1. **Component Design**
   - Use the appropriate View component based on data visualization needs
   - Leverage lazy loading for performance optimization
   - Implement proper loading states for all data-dependent components
   - Handle errors with dedicated error boundaries

2. **Data Management**
   - Use `useCompaniesQuery` for data fetching
   - Use `useCompanyStore` for global state management
   - Apply filters through dedicated hooks like `useFilteredBusinesses`
   - Implement proper caching with React Query

3. **Accessibility**
   - Ensure all interactive elements are keyboard accessible
   - Use proper ARIA attributes, especially in complex components like TableView
   - Maintain sufficient color contrast for all UI elements
   - Provide alternative text for map visualizations

4. **Performance**
   - Use virtualization for large data tables
   - Implement lazy loading for view components
   - Optimize map rendering with proper memoization
   - Apply proper filtering logic to reduce render cycles 
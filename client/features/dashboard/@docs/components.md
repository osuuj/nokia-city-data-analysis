# Dashboard Components

This document provides information about the components used in the Dashboard feature.

## Component Categories

The Dashboard feature is organized into several component categories:

### Core Components

- **ViewSwitcher** - Allows switching between different view modes (table, map, split, analytics)
- **DashboardContent** - Renders the main content based on the selected view mode
- **FilterGroup** - Provides filtering capabilities for the dashboard data

### Table Components

- **TableView** - Renders tabular data with sorting, filtering, and pagination
- **VirtualizedTable** - Optimized table for large datasets with virtualization
- **TableToolbar** - Contains controls for filtering, searching, and view options
- **FilterGroup** - Groups related filters (industries, distance)
- **DistanceSlider** - Allows filtering by distance from a location

### Map Components

- **MapView** - Renders geographic data on an interactive map
- **MapControls** - Provides controls for zooming, panning, and layers
- **MapMarker** - Displays markers on the map for businesses

### Analytics Components

- **AnalyticsView** - Renders analytics and metrics visualizations
- **CityComparisonCard** - Compares metrics across different cities
- **IndustryDistributionCard** - Shows the distribution of industries
- **TopCitiesCard** - Displays top cities based on various metrics
- **IndustriesByCityCard** - Shows industry breakdown by city

### Selection Components

- **CitySelection** - Allows selecting cities for filtering
- **IndustrySelection** - Allows selecting industries for filtering

### Utility Components

- **ErrorDisplay** - Displays error messages
- **LoadingIndicator** - Shows loading states
- **Skeletons** - Placeholder UI during loading

## Component Hierarchy

```
ViewSwitcher
├── TableView
│   ├── TableToolbar
│   │   ├── SearchBar
│   │   ├── FilterGroup
│   │   └── ViewModeToggle
│   └── VirtualizedTable
├── MapView
│   ├── MapControls
│   └── MapLayers
└── AnalyticsView
    ├── CitySelection
    ├── IndustrySelection
    ├── TopCitiesCard
    ├── IndustryDistributionCard
    ├── IndustriesByCityCard
    └── CityComparisonCard
```

## Component Usage

### ViewSwitcher

The `ViewSwitcher` is the main component that controls the display of different views:

```tsx
import { ViewSwitcher } from '@/features/dashboard/components/ViewSwitcher';

<ViewSwitcher
  data={filteredData}
  allFilteredData={allFilteredData}
  selectedBusinesses={selectedBusinesses}
  geojson={geojson}
  viewMode={viewMode}
  setViewMode={setViewMode}
  columns={columns}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={onPageChange}
  isLoading={isLoading}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  sortDescriptor={sortDescriptor}
  setSortDescriptor={setSortDescriptor}
/>
```

### TableView

The `TableView` displays data in a tabular format:

```tsx
import { TableView } from '@/features/dashboard/components/table';

<TableView
  data={data}
  allFilteredData={allFilteredData}
  columns={columns}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={onPageChange}
  isLoading={isLoading}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  sortDescriptor={sortDescriptor}
  setSortDescriptor={setSortDescriptor}
/>
```

### AnalyticsView

The `AnalyticsView` displays analytics data with various charts and metrics:

```tsx
import { AnalyticsView } from '@/features/dashboard/views/AnalyticsView';

<AnalyticsView />
```

## Best Practices

1. Use skeleton loaders during data fetching to improve user experience
2. Implement error boundaries around complex components
3. Use React.memo for pure components to prevent unnecessary re-renders
4. Follow component composition patterns for reusability
5. Use lazy loading for heavy components to improve initial load time 
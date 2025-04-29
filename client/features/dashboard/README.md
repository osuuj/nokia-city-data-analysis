# Dashboard Feature

The Dashboard feature provides a comprehensive interface for exploring, analyzing, and visualizing business data across different cities in Finland. It combines tabular views, geographic visualization, and analytics into a cohesive user experience.

## Key Features

- **Multi-view Interface**: Switch between table, map, split, and analytics views
- **Advanced Filtering**: Filter businesses by city, industry, and geographic proximity
- **Interactive Map**: Visualize business locations with clustering and detailed popups
- **Business Analytics**: View and compare business metrics across cities and industries
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Performance Optimized**: Virtualized tables and lazy-loaded components for smooth performance

## Architecture

The Dashboard feature follows a modular, component-based architecture with clear separation of concerns:

- **Components**: Reusable UI building blocks organized by function
- **Hooks**: Custom React hooks for data fetching, state management, and side effects
- **Store**: Global state management using Zustand stores
- **Context**: React Context providers for component tree state
- **Types**: TypeScript interfaces and types for type safety
- **Utils**: Utility functions and helpers for common operations
- **Views**: Main view components that compose the UI

## Getting Started

### Basic Usage

Import the `DashboardView` component to render the full dashboard experience:

```tsx
import { DashboardView } from '@/features/dashboard';

function App() {
  return <DashboardView />;
}
```

### Using Specific Views

For more granular control, you can use individual view components:

```tsx
import { TableView, MapView, AnalyticsView } from '@/features/dashboard';

function CustomDashboard() {
  const [viewMode, setViewMode] = useState('table');
  
  return (
    <div>
      <div className="view-controls">
        <button onClick={() => setViewMode('table')}>Table</button>
        <button onClick={() => setViewMode('map')}>Map</button>
        <button onClick={() => setViewMode('analytics')}>Analytics</button>
      </div>
      
      {viewMode === 'table' && <TableView data={businessData} />}
      {viewMode === 'map' && <MapView geojson={geojsonData} />}
      {viewMode === 'analytics' && <AnalyticsView />}
    </div>
  );
}
```

### Using the ViewSwitcher

For a more integrated approach, use the `ViewSwitcher` component:

```tsx
import { ViewSwitcher } from '@/features/dashboard';
import { useState } from 'react';

function CustomDashboard({ data }) {
  const [viewMode, setViewMode] = useState('table');
  
  return (
    <ViewSwitcher
      data={data}
      allFilteredData={data}
      viewMode={viewMode}
      setViewMode={setViewMode}
      // ... other props
    />
  );
}
```

## Accessing State

The dashboard exposes Zustand stores that can be used to access and modify dashboard state:

```tsx
import { useCompanyStore, useSelectionStore } from '@/features/dashboard/store';

function BusinessCount() {
  const selectedCity = useCompanyStore((state) => state.selectedCity);
  const selectedRows = useSelectionStore((state) => state.selectedRows);
  
  return (
    <div>
      <p>Selected City: {selectedCity}</p>
      <p>Selected Businesses: {Object.keys(selectedRows).length}</p>
    </div>
  );
}
```

## Customization

### Custom Styling

The dashboard components accept standard className and style props for customization:

```tsx
import { TableView } from '@/features/dashboard';

function StyledDashboard() {
  return (
    <TableView
      data={data}
      className="custom-table"
      style={{ maxHeight: '500px' }}
    />
  );
}
```

### Custom Columns

You can customize table columns:

```tsx
import { TableView } from '@/features/dashboard';

const customColumns = [
  {
    key: 'business_id',
    label: 'ID',
    visible: true,
  },
  {
    key: 'company_name',
    label: 'Company',
    visible: true,
    renderCell: (item) => (
      <div className="company-cell">
        <strong>{item.company_name}</strong>
        <small>{item.industry}</small>
      </div>
    ),
  },
  // ... more columns
];

function CustomTableView() {
  return <TableView data={data} columns={customColumns} />;
}
```

## Performance Considerations

- Use the `useMemo` hook for expensive computations
- Implement virtualization for large datasets
- Lazy load components that aren't immediately visible
- Use proper key props in lists for optimal rendering
- Leverage pagination for large datasets

## Documentation

For more detailed documentation, see the following resources:

- [Architecture Overview](./docs/architecture/README.md) 
- [API Documentation](./docs/api/README.md)
- [Component Documentation](./docs/components.md)
- [Hooks Documentation](./docs/hooks.md)
- [Type Definitions](./docs/types.md)
- [Utility Functions](./docs/utils.md)
- [State Management](./docs/store.md)
- [Context Providers](./docs/context.md)

## Directory Structure

```
client/features/dashboard/
├── components/        - Reusable UI components 
│   ├── analytics/     - Analytics components
│   ├── map/           - Map components
│   ├── table/         - Table components
│   ├── controls/      - Control components
│   └── ViewSwitcher/  - View switching component
├── hooks/             - Custom React hooks
│   ├── analytics/     - Analytics-specific hooks
│   └── data/          - Data fetching hooks
├── store/             - Zustand state management
├── types/             - TypeScript type definitions
├── utils/             - Utility functions
│   ├── geo.ts         - Geographic utilities
│   ├── table.ts       - Table utilities
│   └── errorHandling.ts - Error handling utilities
├── views/             - Main view components
└── index.ts           - Public API exports
``` 
# Dashboard Feature

This directory contains the dashboard feature of the application, which provides a comprehensive view of business data across different cities.

## Directory Structure

```
client/features/dashboard/
├── components/
│   ├── analytics/
│   │   ├── cards/
│   │   ├── charts/
│   │   ├── selection/
│   │   ├── utils/
│   │   ├── AnalyticsView.tsx
│   │   ├── index.ts
│   │   └── types.ts
│   ├── map/
│   │   ├── MapView.tsx
│   │   └── index.ts
│   ├── table/
│   │   ├── toolbar/
│   │   │   ├── TableToolbar.tsx
│   │   │   └── index.ts
│   │   ├── TableView.tsx
│   │   └── index.ts
│   ├── controls/
│   │   ├── ViewModeToggle/
│   │   ├── CitySearch/
│   │   └── index.ts
│   ├── ViewSwitcher/
│   │   ├── ViewSwitcher.tsx
│   │   └── index.ts
│   ├── DashboardError.tsx
│   ├── DashboardFooter.tsx
│   ├── DashboardHeader.tsx
│   └── DashboardSidebar.tsx
├── hooks/
│   ├── analytics/
│   │   ├── useAnalytics.ts
│   │   └── index.ts
│   ├── data/
│   │   ├── useDashboardData.ts
│   │   └── index.ts
│   ├── useDashboard.ts
│   └── index.ts
├── store/
│   ├── companyStore.ts
│   └── index.ts
├── types/
│   ├── analytics.ts
│   ├── business.ts
│   ├── common.ts
│   ├── filters.ts
│   ├── table.ts
│   ├── view.ts
│   └── index.ts
├── utils/
│   ├── geo.ts
│   ├── lazyLoading.ts
│   ├── table.ts
│   └── index.ts
├── views/
│   └── DashboardView.tsx
└── index.ts
```

## Components

### Core Dashboard Components
- `DashboardError.tsx`: Component for displaying error messages
- `DashboardFooter.tsx`: Footer component for the dashboard
- `DashboardHeader.tsx`: Header component with navigation
- `DashboardSidebar.tsx`: Sidebar component for navigation

### Analytics
- `AnalyticsView.tsx`: Main component for the analytics view
- `cards/`: Components for displaying analytics cards
- `charts/`: Components for displaying analytics charts
- `selection/`: Components for selecting data in the analytics view
- `utils/`: Utility functions for the analytics view

### Map
- `MapView.tsx`: Main component for the map view

### Table
- `TableView.tsx`: Main component for the table view
- `toolbar/`: Components for the table toolbar

### Controls
- `ViewModeToggle/`: Components for toggling between view modes
- `CitySearch/`: Components for searching cities

### ViewSwitcher
- `ViewSwitcher.tsx`: Component for switching between different views

## Hooks

### Core Dashboard Hooks
- `useDashboard.ts`: Hook for managing dashboard state and actions

### Analytics
- `useAnalytics.ts`: Hook for fetching and managing analytics data
- `useChartTheme.ts`: Hook for managing chart themes

### Data
- `useDashboardData.ts`: Hook for fetching and managing dashboard data
- `useDashboardLoading.ts`: Hook for managing loading states
- `useCities.ts`: Hook for fetching and managing cities data
- `useCompanies.ts`: Hook for fetching and managing companies data
- `useCompaniesQuery.ts`: Hook for querying companies data
- `useFilteredBusinesses.ts`: Hook for filtering businesses data
- `usePrefetchData.ts`: Hook for prefetching data

## Store
- `companyStore.ts`: Store for managing company data

## Types
- `analytics.ts`: Types for analytics data and components
- `business.ts`: Types for business data
- `common.ts`: Common types used across the dashboard
- `filters.ts`: Types for filtering options
- `table.ts`: Types for table data and configuration
- `view.ts`: Types for view modes and configuration

## Utils
- `geo.ts`: Utility functions for geographic data
- `lazyLoading.ts`: Utility functions for lazy loading components
- `table.ts`: Utility functions for table data

## Views
- `DashboardView.tsx`: Main view component that orchestrates the dashboard layout 
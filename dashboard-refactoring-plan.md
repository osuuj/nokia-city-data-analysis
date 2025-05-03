# Dashboard Feature Refactoring Plan

## Current Understanding of Dashboard Structure

The dashboard is a complex feature with multiple views and shared components:

- **Layout Components**:
  - Sidebar (navigation and filters)
  - Header (with view switcher buttons, theme toggle, GitHub link)
  - Footer

- **Views**:
  - Table View (data table with toolbar)
  - Map View (geographic visualization)
  - Split View (combined map and table)
  - Analytics View (multiple cards and charts)

- **Shared Components**:
  - City search/autocomplete (used across views)
  - Loading states
  - Error handling
  - Common UI elements

## Current Structure Issues

1. **Scattered Components**: Analytics components are spread across multiple directories (`analytics-cards`, `analytics-charts`, etc.)
2. **Duplicated Functionality**: City search appears in multiple views but isn't extracted to a reusable component
3. **Large Components**: `DashboardPage.tsx` (11KB) handles too many responsibilities
4. **Unclear Boundaries**: Between shared components and feature-specific components
5. **Multiple Error Handling Approaches**: Several error components with overlapping functionality
6. **Deprecated Components**: Still maintained in the codebase

## New Proposed Structure

```
client/features/dashboard/
  ├── components/             - Dashboard UI components
  │   ├── layout/             - Layout structure
  │   │   ├── Sidebar.tsx
  │   │   ├── Header.tsx
  │   │   └── Footer.tsx
  │   ├── views/              - Major view components
  │   │   ├── TableView/      - Table view and components
  │   │   │   ├── index.tsx
  │   │   │   └── TableToolbar.tsx
  │   │   ├── MapView/        - Map view components
  │   │   │   ├── index.tsx
  │   │   │   └── MapControls.tsx
  │   │   ├── SplitView/      - Split view (map+table)
  │   │   │   └── index.tsx
  │   │   └── AnalyticsView/  - Analytics components
  │   │       ├── index.tsx
  │   │       ├── cards/      - Analytics cards
  │   │       └── charts/     - Analytics charts
  │   ├── common/             - Shared dashboard components
  │   │   ├── CitySearch/     - Extracted search component
  │   │   │   ├── index.tsx
  │   │   │   └── Autocomplete.tsx
  │   │   ├── ViewSwitcher.tsx
  │   │   ├── DashboardPage.tsx (orchestration component)
  │   │   ├── error/          - Consolidated error components
  │   │   └── loading/        - Loading components
  │   └── controls/           - UI controls and filters
  ├── hooks/                  - Custom hooks (data + UI logic)
  │   ├── useCitySearch.ts    - Extracted search logic
  │   ├── useTableData.ts
  │   ├── useMapData.ts
  │   └── useAnalyticsData.ts
  ├── store/                  - State management
  ├── types/                  - Type definitions
  ├── services/               - API services
  │   └── cityApi.ts          - City data fetching
  ├── utils/                  - Utility functions
  └── config/                 - Configuration
```

## Key Improvements

1. **View-Based Organization**: Structure follows the application's UI organization
2. **Extracted City Search**: Common search functionality moved to a dedicated component
3. **Logical Component Grouping**: Components organized by their purpose and relationship
4. **Separated Data Fetching**: Logic moved to dedicated hooks for reusability
5. **Reduced Component Size**: Large components split into smaller, focused ones
6. **Consolidated Error Handling**: Unified approach to error handling

## Action Items and Progress

1. **Initial Structure Setup**
   - [x] Create the view-based directory structure
   - [x] Set up skeleton components for all views (TableView, MapView, SplitView, AnalyticsView)
   - [x] Move remaining components to their appropriate locations

2. **Extract Common Components**
   - [x] Create a CitySearch component in the common directory
   - [x] Update imports to use the new CitySearch component
   - [ ] Move search logic to a dedicated hook

3. **Organize Analytics View**
   - [x] Create analytics types in a dedicated file
   - [x] Move CityComparisonCard to AnalyticsView/cards
   - [x] Move CityComparison chart to AnalyticsView/charts
   - [x] Move IndustriesByCityCard to AnalyticsView/cards
   - [x] Move IndustryDistributionCard to AnalyticsView/cards
   - [x] Move TopCitiesCard to AnalyticsView/cards
   - [x] Move IndustryDistribution chart to AnalyticsView/charts
   - [x] Move TopCitiesChart to AnalyticsView/charts
   - [x] Move CityIndustryBars chart to AnalyticsView/charts

4. **Organize Other Views**
   - [ ] Move table components to TableView directory
   - [ ] Move map components to MapView directory
   - [x] Implement SplitView with proper component composition

5. **Refactor DashboardPage.tsx**
   - [ ] Split into smaller components
   - [ ] Extract logic to custom hooks
   - [ ] Make it a lighter orchestration component

6. **Clean Up Error Handling**
   - [x] Implement consistent error handling in view components
   - [ ] Remove deprecated error components
   - [ ] Consolidate error handling approach across the feature

7. **Data Fetching Improvements** (for future phase)
   - [ ] Centralize API calls in services
   - [ ] Create data fetching hooks for each view
   - [ ] Implement proper caching and error handling

## Next Steps

1. **Complete Table View**
   - Move table components from current location
   - Create table data controller
   - Implement pagination controls

2. **Implement Map View**
   - Move map components from current location
   - Create proper Map controller component
   - Add map interaction functionality

3. **Review and fix linting issues**
   - Fix any remaining linting issues in the refactored components
   - Ensure all index.ts files export only components

4. **Extract Common Functionality**
   - Create reusable data fetching hooks
   - Establish shared utility functions

## Benefits

- **Improved Maintainability**: Easier to find and modify related code
- **Better Code Reuse**: Common components extracted for reuse across views
- **Reduced Duplication**: Shared functionality not duplicated across views
- **More Focused Components**: Each component has clearer responsibilities
- **Easier Testing**: Smaller components with clear boundaries are easier to test
- **Better Performance**: Potential for optimized rendering with properly separated components

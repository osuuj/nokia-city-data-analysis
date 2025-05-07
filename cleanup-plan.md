# Skeleton and Error Component Cleanup Plan

This document outlines the plan for removing duplicate skeleton and error components and replacing them with the shared components.

## Completed Tasks

### Shared Components Created
- ✅ Created `AnimatedBackgroundSkeleton` in `client/shared/components/loading/`
- ✅ Created card skeletons in `client/shared/components/loading/CardSkeletons.tsx`:
  - `BasicCardSkeleton`
  - `ResourceCardSkeleton`
  - `HeaderSectionSkeleton`
  - `CardGridSkeleton`
- ✅ Created `TableSkeleton` component in `client/shared/components/loading/TableSkeleton.tsx`
- ✅ Created `MapSkeleton` component in `client/shared/components/loading/MapSkeleton.tsx`
- ✅ Created `ChartSkeleton` component in `client/shared/components/loading/ChartSkeleton.tsx` for all analytics visualization skeletons
- ✅ Created shared error components in `client/shared/components/error/`:
  - `ErrorBoundary`
  - `FeatureErrorBoundary`
  - `withErrorBoundary`
  - `ErrorDisplay`

### Updates to Feature Components
- ✅ Marked `TeamMemberCardSkeleton` as deprecated and updated to use shared components
- ✅ Updated `ResourcesSkeleton` to use shared components
- ✅ Updated `ContactPageSkeleton` to use shared components
- ✅ Updated exported components in `client/shared/components/loading/index.ts`
- ✅ Marked dashboard skeleton components as deprecated in `client/features/dashboard/components/common/loading/Skeletons.tsx`

### Error Components Deleted
- ✅ Deleted `client/features/dashboard/components/common/error/DashboardErrorBoundary.tsx`
- ✅ Deleted `client/features/dashboard/components/common/error/withDashboardErrorBoundary.tsx`
- ✅ Deleted `client/features/dashboard/components/common/error/ErrorDisplay.tsx`
- ✅ Updated `client/features/dashboard/components/common/error/index.ts` to remove references to deleted files

### Documentation
- ✅ Created documentation for shared loading components with examples
- ✅ Updated documentation to include new TableSkeleton component
- ✅ Updated documentation to include new MapSkeleton component
- ✅ Updated documentation to include new ChartSkeleton component
- ✅ Created migration guide in `client/shared/components/loading/MIGRATION.md`

### Component Migration Examples
- ✅ Updated `client/features/dashboard/components/common/BaseCard.tsx` to use the new `ChartSkeleton`
- ✅ Updated `client/features/dashboard/components/controls/Toggles/ViewSwitcher.tsx` to use `ChartSkeleton`

### Dashboard Skeleton Migration
- ✅ Created `DashboardLoadingState` component as replacement for `DashboardSkeleton`
- ✅ Updated `client/features/dashboard/components/common/DashboardPage.tsx` to use `DashboardLoadingState`
- ✅ Updated `client/features/dashboard/components/controls/Toggles/ViewSwitcher.tsx` to use shared `MapSkeleton`
- ✅ Updated `client/features/dashboard/components/common/loading/index.ts` to remove deprecated exports

### Analytics Skeleton Migration
- ✅ Created `AnalyticsDashboardLoadingState` component as replacement for `AnalyticsDashboardSkeleton`
- ✅ Updated feature-specific `ChartSkeleton` in `client/features/dashboard/components/views/AnalyticsView/cards/ChartSkeleton.tsx` to use shared component
- ✅ Updated `client/features/dashboard/components/views/AnalyticsView/index.tsx` to export the new loading state component

## Remaining Work

### Migration Plan
- [ ] Replace remaining usages of deprecated dashboard skeletons with shared components:
  - [x] Replace `DashboardSkeleton` with appropriate shared components
  - [x] Replace remaining usages of dashboard `MapSkeleton` with shared `MapSkeleton`
  - [x] Replace remaining usages of `AnalyticsSkeleton` with shared `ChartSkeleton`
  - [x] Replace remaining usages of dashboard `TableSkeleton` with shared `TableSkeleton`
- [ ] After thorough testing, remove deprecated components:
  - [ ] Remove `client/features/dashboard/components/common/loading/Skeletons.tsx`

## Migration Strategy
1. ✅ Ensure all components are marked with @deprecated tags
2. ✅ Update components to use shared alternatives
3. ✅ Create documentation for the shared components
4. ✅ Create remaining shared skeleton components:
   - ✅ TableSkeleton
   - ✅ MapSkeleton
   - ✅ ChartSkeleton
5. ✅ Start replacing component usages with shared components
6. ✅ Continue replacing component usages throughout the codebase:
   - ✅ Dashboard and ViewSwitcher components migrated
   - ✅ AnalyticsView components migrated
7. [ ] After sufficient time for testing, remove the deprecated components entirely 
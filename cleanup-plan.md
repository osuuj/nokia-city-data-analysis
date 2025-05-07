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

## Future Work

### Additional Shared Components to Create
- [ ] Create shared `MapSkeleton` component
- [ ] Create shared analytics visualization skeletons

### Migration Plan
- [ ] Gradually replace usages of deprecated dashboard skeletons with shared components
- [ ] After thorough testing, remove deprecated components

## Migration Strategy
1. ✅ Ensure all components are marked with @deprecated tags
2. ✅ Update components to use shared alternatives
3. ✅ Create documentation for the shared components
4. ✅ Start creating remaining shared skeleton components (TableSkeleton complete)
5. [ ] Complete remaining skeleton components (map, analytics)
6. [ ] After sufficient time for testing, remove the deprecated components entirely 
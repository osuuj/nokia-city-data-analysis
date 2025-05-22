# About Feature

This directory contains components and data for the About section of the application, including team profiles and information.

## Architectural Overview

### Component Structure

- **Team Component**: Combines both story and team members list on the main about page
- **Dynamic Profile Pages**: A single component that loads data based on profile ID
- **Generic Section Components**: Reusable components for profile sections
  - ProfileHero, ProfileSkills, ProfileExperience, etc.

### Data Flow

1. **Data Sources**:
   - Team members data: `teamMembers.ts`
   - Individual profile data: `juusoData.ts`, `kassuData.ts`, etc.
   - Combined profiles via `profileDataMap` in data/index.ts

2. **Data Loading**:
   - Main About page: Loads team members directly from data
   - Profile pages: Uses dynamic routing with `[profileId]` parameter

3. **Routing**:
   - Dynamic routes only: `/about/[profileId]` for all team members
   - Static routes have been deprecated

## Benefits of This Architecture

1. **Reduced Duplication**: Eliminated multiple duplicated component files
2. **Data-Driven Approach**: Components load content from data sources
3. **Maintainability**: Adding new team members only requires data changes
4. **Performance**: Shared components reduce bundle size
5. **Type Safety**: TypeScript ensures data consistency

## Adding a New Team Member

To add a new team member:

1. Add the member to `teamMembers.ts`
2. Create a data file (e.g., `newMemberData.ts`) following existing patterns
3. Add the new profile to `profileDataMap` in data/index.ts
4. The dynamic route will automatically handle the page at `/about/new-member-id`

No new components needed!

## Component Usage

Example of accessing a profile page:

```tsx
// This will automatically work with the dynamic routing
// No need for separate page components per profile
// The URL would be /about/member-id
```

## Structure

- **/components**: UI components used in the About section
  - **/sections**: Page section components (hero, skills, projects, etc.)
  - **/ui**: Reusable UI components specific to the About feature

- **/data**: Data sources and mock data
  - `index.ts`: Exports the profileDataMap for all profiles
  - `juusoData.ts`: Data for Juuso's profile
  - `kassuData.ts`: Data for Kassu's profile
  - `teamMembers.ts`: Team member list with basic info

- **/types**: TypeScript type definitions for the About feature
  - `profileTypes.ts`: Comprehensive types for profiles and team members

## Implementation

### Component Architecture

The feature is built with a modular component approach:

1. **Generic Components**: 
   - `ProfileHero`, `ProfileSkills`, `ProfileExperience`, etc. accept props for customization
   - These components don't contain hardcoded content
   - They handle layout, animations, and presentation logic

2. **Data-driven Approach**:
   - Data is defined in separate files (`juusoData.ts`, `kassuData.ts`, etc.)
   - The dynamic routing loads data for the specific profile from the profileDataMap
   - This separates data from presentation

### Consolidation Pattern

The consolidation pattern:

1. Generic, reusable section components that accept props
2. Consistent layout with dynamic page loading
3. Profile-specific data loaded through profileDataMap
4. Maintainable code with clean separation of concerns

## Recent Improvements

The About feature has been refactored to:

1. Remove deprecated profile-specific components (JuusoHero, KassuHero, etc.)
2. Replace static routes with dynamic routing
3. Consolidate duplicate type definitions
4. Create a more maintainable data structure with profileDataMap
5. Fix TypeScript issues and React key warnings
6. Follow the DRY principle throughout the codebase 
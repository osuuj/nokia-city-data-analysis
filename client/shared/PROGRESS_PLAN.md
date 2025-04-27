# Dashboard Feature Refactoring Progress

## Tech Stack and Architecture

This feature is part of a Next.js application built with:
- **Next.js**: For server-side rendering and routing
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling and responsive design
- **HeroUI**: For UI components and design system
- **Feature-based Architecture**: Each feature is self-contained with its own components, hooks, types, and utilities
- **FastAPI Backend**: For API endpoints and data fetching
- **PostgreSQL**: For data storage
- **Mapbox**: For data visualization and mapping

The application follows a feature-based architecture where each feature is self-contained and follows a consistent structure:
- `components/`: UI components specific to the feature
- `hooks/`: Custom React hooks for feature-specific logic
- `types/`: TypeScript type definitions
- `utils/`: Utility functions
- `data/`: Data fetching and API integration
- `store/`: State management (if needed)

## App Structure Overview

The app folder contains Next.js pages and API routes with the following structure:
- **Key Pages**:
  - Home page (`page.tsx`)
  - Project pages (`project/page.tsx`, `project/[id]/page.tsx`)
  - Contact page (`contact/page.tsx`)
  - Dashboard page (`dashboard/page.tsx`)
  - About page (`about/page.tsx`)
  - Resources page (`resources/page.tsx`)

- **API Routes**:
  - Avatar API (`api/avatar/`)
  - Cities API (`api/cities/`)
  - Analytics API (`api/analytics/`)
  - Companies API (`api/companies/`) 
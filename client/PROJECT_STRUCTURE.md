# Project Structure Documentation

## Overview
This document outlines the detailed structure of the client-side application, which follows a feature-based architecture with shared resources and Next.js app router implementation.

## Complete Directory Structure

```
client/
├── app/                           # Next.js app router pages and layouts
│   ├── about/                    # About page route
│   │   └── page.tsx             # About page component
│   ├── contact/                  # Contact page route
│   │   └── page.tsx             # Contact page component
│   ├── dashboard/               # Dashboard page route
│   │   └── page.tsx             # Dashboard page component
│   ├── project/                 # Project page route
│   │   └── page.tsx             # Project page component
│   ├── resources/               # Resources page route
│   │   └── page.tsx             # Resources page component
│   ├── error.tsx                # Global error handling
│   ├── globals.css              # Global styles
│   ├── icon.png                 # App icon
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── features/                     # Feature-based modules
│   ├── api/                     # API integration layer
│   │   ├── endpoints/          # API endpoint definitions
│   │   ├── types/             # API type definitions
│   │   └── index.ts           # API module exports
│   │
│   ├── dashboard/               # Dashboard feature
│   │   ├── components/         # Dashboard-specific components
│   │   │   ├── table/         # Table components
│   │   │   │   ├── DataTable.tsx
│   │   │   │   └── TableControls.tsx
│   │   │   ├── views/         # View components
│   │   │   │   ├── DashboardView.tsx
│   │   │   │   └── AnalyticsView.tsx
│   │   │   └── controls/      # Control components
│   │   │       ├── FilterControls.tsx
│   │   │       └── DateRangePicker.tsx
│   │   ├── hooks/             # Custom hooks for dashboard
│   │   │   ├── useDashboardData.ts
│   │   │   └── useDashboardFilters.ts
│   │   ├── utils/             # Utility functions
│   │   │   ├── dataTransformers.ts
│   │   │   └── formatters.ts
│   │   ├── data/              # Data models and types
│   │   │   ├── models.ts
│   │   │   └── schemas.ts
│   │   ├── types/             # TypeScript type definitions
│   │   │   ├── dashboard.types.ts
│   │   │   └── api.types.ts
│   │   ├── store/             # State management
│   │   │   ├── dashboardSlice.ts
│   │   │   └── index.ts
│   │   └── index.ts           # Public API
│   │
│   ├── layout/                 # Layout feature
│   │   ├── components/        # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── index.ts           # Layout exports
│   │
│   ├── landing/                # Landing page feature
│   │   ├── components/        # Landing page components
│   │   │   ├── Hero.tsx
│   │   │   └── Features.tsx
│   │   └── index.ts           # Landing exports
│   │
│   ├── team/                   # Team feature
│   │   ├── components/        # Team components
│   │   │   ├── TeamMember.tsx
│   │   │   └── TeamList.tsx
│   │   └── index.ts           # Team exports
│   │
│   ├── about/                  # About feature
│   │   ├── components/        # About components
│   │   │   └── AboutContent.tsx
│   │   └── index.ts           # About exports
│   │
│   ├── contact/                # Contact feature
│   │   ├── components/        # Contact components
│   │   │   ├── ContactForm.tsx
│   │   │   └── ContactInfo.tsx
│   │   └── index.ts           # Contact exports
│   │
│   ├── project/                # Project feature
│   │   ├── components/        # Project components
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectList.tsx
│   │   └── index.ts           # Project exports
│   │
│   └── resources/              # Resources feature
│       ├── components/        # Resources components
│       │   ├── ResourceCard.tsx
│       │   └── ResourceList.tsx
│       └── index.ts           # Resources exports
│
├── shared/                      # Shared resources
│   ├── api/                    # API client and types
│   │   ├── client.ts          # API client implementation
│   │   ├── types.ts           # API types
│   │   └── index.ts           # API exports
│   │
│   ├── components/             # Shared components
│   │   ├── ui/                # UI components
│   │   │   ├── background/    # Background components
│   │   │   │   └── GradientBackground.tsx
│   │   │   ├── loading/       # Loading components
│   │   │   │   └── Spinner.tsx
│   │   │   ├── theme/         # Theme components
│   │   │   │   └── ThemeToggle.tsx
│   │   │   └── index.ts       # UI components exports
│   │   ├── error/             # Error components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── data/              # Data display components
│   │   │   ├── DataCard.tsx
│   │   │   └── DataList.tsx
│   │   └── layout/            # Layout components
│   │       ├── Container.tsx
│   │       └── Grid.tsx
│   │
│   ├── config/                 # Configuration files
│   │   ├── constants.ts       # Application constants
│   │   └── theme.ts           # Theme configuration
│   │
│   ├── context/                # React context providers
│   │   ├── ThemeContext.tsx
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/                  # Shared custom hooks
│   │   ├── useTheme.ts
│   │   └── useAuth.ts
│   │
│   ├── icons/                  # Icon components
│   │   ├── Logo.tsx
│   │   └── index.ts
│   │
│   ├── layout/                 # Layout components
│   │   ├── MainLayout.tsx
│   │   └── AuthLayout.tsx
│   │
│   ├── providers/              # Global providers
│   │   ├── ThemeProvider.tsx
│   │   └── AuthProvider.tsx
│   │
│   ├── styles/                 # Shared styles
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   ├── types/                  # Shared TypeScript types
│   │   ├── common.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   │
│   └── index.ts                # Public API
│
├── public/                     # Static assets
│   ├── images/                # Image assets
│   │   ├── logo.png
│   │   └── icons/
│   └── fonts/                 # Font files
│
├── package.json                # Project dependencies
├── package-lock.json           # Dependency lock file
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── next-env.d.ts              # Next.js type definitions
├── Dockerfile                 # Docker configuration
├── biome.json                 # Biome configuration
├── postcss.config.js          # PostCSS configuration
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
├── .npmrc                     # NPM configuration
└── LICENSE                    # License file
```

## File Descriptions

### App Directory (`/app`)
- `page.tsx` - Home page component
- `layout.tsx` - Root layout component with global providers
- `error.tsx` - Global error boundary component
- `globals.css` - Global styles and CSS variables

### Features Directory (`/features`)
Each feature module follows a consistent structure:
- `components/` - Feature-specific components
- `hooks/` - Custom hooks for the feature
- `utils/` - Utility functions
- `types/` - TypeScript type definitions
- `store/` - State management (if needed)
- `index.ts` - Public API exports

### Shared Directory (`/shared`)
- `api/` - Centralized API client and types
- `components/` - Reusable UI components
- `config/` - Application configuration
- `context/` - React context providers
- `hooks/` - Shared custom hooks
- `icons/` - Icon components
- `layout/` - Layout components
- `providers/` - Global providers
- `styles/` - Shared styles
- `types/` - Shared TypeScript types
- `utils/` - Utility functions

## Component Guidelines

### UI Components (`/shared/components/ui`)
- Should be atomic and reusable
- Include proper TypeScript types
- Follow a consistent naming convention
- Include proper documentation
- Support theme customization

### Feature Components (`/features/*/components`)
- Should be feature-specific
- Can use shared components
- Include proper error handling
- Follow feature-specific patterns

### Layout Components (`/shared/components/layout`)
- Should be flexible and reusable
- Support different layouts
- Handle responsive design
- Include proper TypeScript types

## State Management

### Feature State (`/features/*/store`)
- Use Redux Toolkit for complex state
- Include proper TypeScript types
- Follow Redux best practices
- Include proper documentation

### Global State (`/shared/context`)
- Use React Context for global state
- Include proper TypeScript types
- Follow React Context best practices
- Include proper documentation

## API Integration

### API Client (`/shared/api`)
- Use Axios or Fetch
- Include proper error handling
- Include proper TypeScript types
- Follow REST API best practices

### Feature API (`/features/*/api`)
- Use shared API client
- Include feature-specific endpoints
- Include proper TypeScript types
- Follow feature-specific patterns

## Testing Structure

Each feature and shared module should include:
- `__tests__/` - Test files
- `*.test.ts` - Unit tests
- `*.test.tsx` - Component tests
- `*.spec.ts` - Integration tests

## Documentation

Each module should include:
- `README.md` - Module documentation
- `*.d.ts` - TypeScript type definitions
- JSDoc comments for functions and components
- Usage examples in documentation 
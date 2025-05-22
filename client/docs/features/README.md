# Features Documentation

This directory contains documentation for each feature in the Nokia City Data Analysis application.

## Available Features

| Feature | Description |
|---------|-------------|
| [Dashboard](./dashboard/README.md) | Main data visualization dashboard with multiple views (map, table, analytics) |
| [Project](./project/README.md) | Project details and showcase |
| [Resources](./resources/README.md) | Resource library and documentation |
| [Landing](./landing/README.md) | Homepage and landing experience |
| [About](./about/README.md) | About pages with team information |
| [Contact](./contact/README.md) | Contact forms and information |

## Feature Architecture

Each feature follows a consistent architecture:

```
feature/
├── components/        # UI components
├── hooks/             # Custom React hooks
├── types/             # TypeScript types
├── utils/             # Utility functions
├── config/            # Configuration
└── index.ts           # Public exports
```

## Best Practices

When developing features:

1. **Encapsulation**: Keep feature-specific code within the feature directory
2. **Shared Components**: Use shared components from `client/shared` whenever possible
3. **Type Safety**: Define and use TypeScript types consistently
4. **Documentation**: Document components, hooks, and utilities according to the template 
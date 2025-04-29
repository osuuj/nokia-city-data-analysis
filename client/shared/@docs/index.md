# Shared Module Documentation

This directory contains comprehensive documentation for the `client/shared` module, which provides reusable components, utilities, hooks, and other building blocks used throughout the application.

## Table of Contents

### Core Documentation

- [Components](./components.md) - Reusable UI components
- [Hooks](./hooks.md) - Custom React hooks
- [Context](./context.md) - React Context providers
- [API](./api.md) - API utilities and types
- [Utils](./utils.md) - Utility functions
- [Types](./types.md) - TypeScript types
- [Styles](./styles.md) - Global styles
- [Providers](./providers.md) - Application providers

### Architecture & Guides

- [Architecture](./architecture.md) - Architecture decisions and patterns
- [Guides](./guides.md) - Usage guides and best practices

### Feature Documentation

- [About Feature](./features/about.md) - About page feature
- [Contact Feature](./features/contact.md) - Contact page feature

### Component Documentation

- [About Components](./components/about.md) - About page components
- [Contact Components](./components/contact.md) - Contact page components

## Overview

The Shared module is designed to promote code reuse and consistency across the application. It provides a foundation for building features with common patterns, components, and utilities.

## Directory Structure

```
client/shared/
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── context/          # React Context providers
├── api/              # API utilities
├── utils/            # Utility functions
├── types/            # TypeScript types
├── styles/           # Global styles
├── providers/        # Application providers
├── services/         # Shared services
├── config/           # Configuration
├── icons/            # Icon components
└── @docs/            # Documentation
```

## Best Practices

When using the shared module, follow these best practices:

1. **Use What's Available**: Before creating new components or utilities, check if something suitable already exists in the shared module.

2. **Maintain Consistency**: Follow the patterns and conventions established in the shared module when creating new components or utilities.

3. **Documentation**: Document new additions to the shared module in this directory, following the established patterns.

4. **Testing**: Thoroughly test shared components and utilities, as they are used across the application.

5. **Performance**: Consider the performance implications of shared components and utilities, especially those used frequently.

6. **Typing**: Use TypeScript types for all shared components and utilities to ensure type safety.

## Contributing

When contributing to the shared module:

1. Place new code in the appropriate directory.
2. Update or create documentation in the `@docs` directory.
3. Follow the established patterns and conventions.
4. Write tests for new functionality.
5. Consider the impact on existing code.

## Further Reading

For more detailed documentation on specific parts of the shared module, see the links in the Table of Contents above. 
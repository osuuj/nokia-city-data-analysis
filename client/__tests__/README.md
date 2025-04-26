# Test Directory Structure

This directory contains shared tests, API tests, and test utilities for the application. We use a hybrid approach to test organization, which combines co-located tests within feature directories and centralized tests in this dedicated `__tests__` directory.

## Overview

We use a hybrid approach to test organization:

1. **Co-located Tests**: Feature-specific tests are kept within each feature directory (e.g., `client/features/dashboard/__tests__/`).
2. **Centralized Tests**: Shared tests, API tests, and test utilities are kept in this centralized `__tests__` directory.

For more details on our test organization strategy, see the [TEST_ORGANIZATION.md](../docs/TEST_ORGANIZATION.md) file.

## Directory Structure

```
client/
├── features/
│   ├── dashboard/
│   │   ├── __tests__/
│   │   │   ├── components/
│   │   │   └── utils/
│   │   └── ...
│   └── ...
├── __tests__/
│   ├── api/
│   │   ├── cities.test.ts
│   │   ├── companies.test.ts
│   │   └── industry-distribution.test.ts
│   ├── shared/
│   │   ├── components/
│   │   └── utils/
│   ├── __mocks__/
│   │   └── fileMock.js
│   └── utils/
│       └── test-utils.tsx
```

## Test Organization

- **Features**: Tests specific to a feature are organized in the feature's `__tests__` directory.
- **API**: Tests for API endpoints are organized in the `api` directory.
- **Shared**: Tests for shared components and utilities are organized in the `shared` directory.
- **Utils**: Test utilities and helpers are organized in the `utils` directory.
- **Mocks**: Mock files for testing are organized in the `__mocks__` directory.

## Running Tests

To run all tests:

```bash
npm test
```

To run tests for a specific feature:

```bash
npm test -- features/dashboard
```

To run tests for a specific file:

```bash
npm test -- features/dashboard/__tests__/components/DashboardHeader.test.tsx
```

## Writing Tests

When writing tests, follow these guidelines:

1. Use the test utilities in `utils/test-utils.tsx` to render components with all necessary providers.
2. Follow the naming convention `*.test.tsx` for test files.
3. Group related tests using `describe` blocks.
4. Use descriptive test names that explain what is being tested.
5. Use the testing-library queries to find elements in the DOM.
6. Use Jest's expect API to make assertions.

## Example Test

```tsx
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import { MyComponent } from '@/features/my-feature/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
``` 
# Usage Guides

This file provides guides for using and contributing to the shared module components and utilities.

## Getting Started

To use the Shared module in your feature or application code:

1. **Import Components, Hooks, or Utilities**

   Example:
   ```tsx
   import { Button } from '@/shared/components/ui';
   import { useForm } from '@/shared/hooks';
   import { cn } from '@/shared/utils';
   ```

2. **Follow the Usage Guidelines**

   - Use shared components for consistent UI/UX.
   - Prefer shared hooks and utilities over duplicating logic.
   - Contribute improvements back to the shared module when possible.

## Component Usage Guide

### Basic Components

Use basic UI components for consistent look and feel:

```tsx
import { Button, Input, Select } from '@/shared/components/ui';

function MyForm() {
  return (
    <form>
      <Input
        label="Username"
        placeholder="Enter your username"
        required
      />
      <Select
        label="Role"
        options={[
          { value: 'admin', label: 'Administrator' },
          { value: 'user', label: 'Regular User' },
        ]}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Layout Components

Use layout components for consistent page structure:

```tsx
import { Header, Footer, Container } from '@/shared/components/layout';

function MyPage() {
  return (
    <>
      <Header />
      <Container>
        <h1>My Page</h1>
        <p>Page content goes here</p>
      </Container>
      <Footer />
    </>
  );
}
```

### Data Components

Use data components for displaying and managing data:

```tsx
import { DataTable, Pagination } from '@/shared/components/data';

function DataDisplay({ data }) {
  return (
    <>
      <DataTable
        data={data}
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Email', accessor: 'email' },
        ]}
      />
      <Pagination totalItems={data.length} />
    </>
  );
}
```

## Extending Shared Utilities

When extending shared utilities, follow these guidelines:

1. **Follow the Folder Structure**
   - Place new components in the appropriate subfolder (ui, layout, data, etc.).
   - Add new hooks, utilities, or types in their respective folders.

2. **Export from Index Files**
   - Every directory should have an index.ts file that exports all components.
   - This allows for clean imports from other parts of the application.

3. **Document with Comments**
   - Use JSDoc comments to document functions, components, and types.
   - Include examples for complex utilities or components.

4. **Write Tests**
   - Add tests for new components and utilities.
   - Test edge cases and error handling.

5. **Update Documentation**
   - Update this guide when adding new patterns or utilities.
   - Document breaking changes and migrations.

## Contributing

When contributing to the Shared module, please:

1. **Create or Modify Tests**
   - Add tests for new functionality.
   - Update tests for modified functionality.

2. **Update Documentation**
   - Update or add to the @docs directory.
   - Include usage examples.

3. **Follow Code Style**
   - Use TypeScript for type safety.
   - Follow the existing code style.
   - Use meaningful variable and function names.

4. **Keep Components Focused**
   - Each component should have a single responsibility.
   - Break down complex components into smaller ones.

5. **Consider Accessibility**
   - Ensure components are accessible.
   - Include proper ARIA attributes and keyboard navigation. 
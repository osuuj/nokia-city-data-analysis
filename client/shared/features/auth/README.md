# Auth Feature

This feature contains components, hooks, and utilities for authentication and authorization.

## Directory Structure

- `components/`: React components for authentication UI
- `hooks/`: Custom React hooks for authentication logic
- `utils/`: Utility functions for authentication and authorization
- `types/`: TypeScript type definitions for authentication
- `context/`: React context providers for authentication state

## Context

### AuthContext

A context provider that manages authentication state and provides authentication methods.

```tsx
import { AuthProvider, useAuth } from '@/shared/features/auth';

// Wrap your app with the AuthProvider
function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

// Use the auth context in your components
function LoginButton() {
  const { login, isAuthenticated } = useAuth();
  
  return (
    <button onClick={() => login('user@example.com', 'password')}>
      {isAuthenticated ? 'Logout' : 'Login'}
    </button>
  );
}
```

## Types

### UserRole

```typescript
type UserRole = 'admin' | 'user' | 'guest';
```

### AuthStatus

```typescript
type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'error';
```

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  preferences?: Record<string, any>;
}
```

## Dependencies

- `react`: For React components and hooks
- `next/navigation`: For routing

## Usage Notes

- The AuthContext is client-side only (marked with 'use client')
- Authentication state is persisted in localStorage
- The context provides methods for login, logout, register, and more

## Usage

Import auth components, hooks, and utilities from this directory when you need to work with authentication or authorization.

Example:
```typescript
import { LoginForm } from '@/shared/features/auth/components/LoginForm';
import { useAuth } from '@/shared/features/auth/hooks/useAuth';
import { checkPermission } from '@/shared/features/auth/utils/permissions';
``` 
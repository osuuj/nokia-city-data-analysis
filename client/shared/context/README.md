# Shared Context

This directory contains React Context providers used across the application for global state management.

## Directory Structure

```
context/
├── loading/           # Loading state context
│   ├── LoadingContext.tsx
│   └── index.ts
├── breadcrumb/        # Breadcrumb navigation context
│   ├── BreadcrumbContext.tsx
│   └── index.ts
├── auth/              # Authentication context
│   ├── AuthContext.tsx
│   └── index.ts
├── ThemeContext.tsx   # Theme context
└── index.ts          # Main export file
```

## Available Contexts

### Loading Context

The Loading Context provides application-wide loading state management.

```typescript
import { useLoading } from '@shared/context';

// In your component
const { loadingState, startLoading, stopLoading } = useLoading();

// Start loading
startLoading({ message: 'Loading data...', type: 'overlay' });

// Stop loading
stopLoading();
```

#### Loading Types
- `overlay` - Full screen loading overlay
- `inline` - Inline loading indicator
- `skeleton` - Skeleton loading state

#### Loading Priorities
- `high` - Critical operations
- `medium` - Standard operations
- `low` - Background operations

### Breadcrumb Context

The Breadcrumb Context manages the current page title and breadcrumb items for navigation.

```typescript
import { useBreadcrumb } from '@shared/context';

// In your component
const { currentPageTitle, setCurrentPageTitle, addItem, removeItem } = useBreadcrumb();

// Set page title
setCurrentPageTitle('Dashboard');

// Add breadcrumb item
addItem({ title: 'Home', url: '/' });
addItem({ title: 'Dashboard', url: '/dashboard' });

// Remove breadcrumb item
removeItem('Home');
```

### Theme Context

The Theme Context manages the application theme.

```typescript
import { useThemeContext } from '@shared/context';

// In your component
const { theme, setTheme, toggleTheme, resetTheme } = useThemeContext();

// Set theme
setTheme('dark');

// Toggle theme
toggleTheme();

// Reset theme
resetTheme();
```

### Auth Context

The Auth Context manages user authentication state.

```typescript
import { useAuth } from '@shared/context';

// In your component
const { user, isAuthenticated, login, logout, register } = useAuth();

// Login
login('user@example.com', 'password');

// Logout
logout();

// Register
register('user@example.com', 'password', 'John Doe');

// Check authentication status
if (isAuthenticated) {
  console.log(`Welcome, ${user?.name}!`);
}
```

## Usage Examples

### Setting up Providers

```typescript
import { LoadingProvider, BreadcrumbProvider, ThemeProvider, AuthProvider } from '@shared/context';

function App({ children }) {
  return (
    <LoadingProvider>
      <BreadcrumbProvider>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </BreadcrumbProvider>
    </LoadingProvider>
  );
}
```

### Using Loading State

```typescript
import { useLoading } from '@shared/context';

function DataLoader() {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading({ message: 'Loading data...' });
    // ... fetch data
    stopLoading();
  }, []);

  return <div>Content</div>;
}
```

### Using Breadcrumbs

```typescript
import { useBreadcrumb } from '@shared/context';

function PageHeader() {
  const { currentPageTitle, addItem } = useBreadcrumb();

  useEffect(() => {
    addItem({ title: 'Home', url: '/' });
    addItem({ title: currentPageTitle, url: window.location.pathname });
  }, [currentPageTitle, addItem]);

  return (
    <header>
      <h1>{currentPageTitle}</h1>
      <BreadcrumbNav />
    </header>
  );
}
```

### Using Theme

```typescript
import { useThemeContext } from '@shared/context';

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    </button>
  );
}
```

### Using Authentication

```typescript
import { useAuth } from '@shared/context';

function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Best Practices

1. **Provider Order**
   - Place providers high in the component tree
   - Consider provider dependencies when ordering

2. **Performance**
   - Use context selectors to prevent unnecessary re-renders
   - Split contexts by domain to minimize re-renders

3. **Type Safety**
   - Always provide proper TypeScript types
   - Use type inference where possible

4. **Error Handling**
   - Implement proper error boundaries
   - Handle edge cases in context providers

## Contributing

When adding new contexts:
1. Create a new directory for the context
2. Implement the context provider and hook
3. Add proper TypeScript types
4. Include JSDoc documentation
5. Add usage examples to this README 
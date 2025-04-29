# Shared Utilities

This file provides documentation for the utility functions in the `client/shared/utils` directory.

## Directory Structure

```
utils/
├── cn.ts           # Class name utility
├── debounce.ts     # Debounce utility
├── cache.ts        # Caching utilities
├── performance.ts  # Performance monitoring utilities
├── transitions.ts  # Transition/animation utilities
├── validation.ts   # Form validation utilities
├── rateLimit.ts    # Rate limiting utilities
└── index.ts        # Main export file
```

## Available Utilities

### Class Name Utility (cn.ts)

The `cn()` utility is used for conditionally joining class names together:

```typescript
import { cn } from '@/shared/utils';

function Button({ className, variant, disabled }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-800',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      Click Me
    </button>
  );
}
```

### Debounce Utility (debounce.ts)

The `debounce()` utility delays the execution of a function:

```typescript
import { debounce } from '@/shared/utils';

// Debounce a function
const handleSearch = debounce((searchTerm) => {
  fetchSearchResults(searchTerm);
}, 300);

// Usage in event handler
<input onChange={(e) => handleSearch(e.target.value)} />;
```

### Caching Utilities (cache.ts)

Utilities for client-side caching:

```typescript
import { cacheData, getCachedData, clearCache } from '@/shared/utils';

// Cache data
cacheData('user-preferences', userPreferences);

// Get cached data
const preferences = getCachedData('user-preferences');

// Clear cache
clearCache('user-preferences');
```

### Performance Utilities (performance.ts)

Utilities for monitoring performance:

```typescript
import { measurePerformance, logPerformance } from '@/shared/utils';

// Measure function execution time
const { result, duration } = measurePerformance(() => {
  return complexCalculation();
});

// Log performance metrics
logPerformance('calculation', duration);
```

### Transition Utilities (transitions.ts)

Utilities for animations and transitions:

```typescript
import { fadeIn, fadeOut, slideIn } from '@/shared/utils';

// Apply transitions
const fadeInElement = fadeIn(elementRef, { duration: 300 });
const slideInElement = slideIn(elementRef, { direction: 'left', duration: 500 });
```

### Validation Utilities (validation.ts)

Form validation utilities:

```typescript
import { validateEmail, validatePassword, validateRequired } from '@/shared/utils';

// Validate form fields
const emailError = validateEmail(email);
const passwordError = validatePassword(password);
const nameError = validateRequired(name, 'Name');
```

## Best Practices

1. **Reuse Utilities**
   - Use these utilities across the application for consistency
   - Avoid reimplementing similar functionality

2. **Type Safety**
   - All utilities have proper TypeScript typings
   - Ensure you're passing the correct parameters

3. **Performance**
   - Use performance utilities to measure and optimize
   - Be careful with debounce timing in user interactions

4. **Error Handling**
   - Check return values and handle edge cases
   - Use try/catch blocks where appropriate 
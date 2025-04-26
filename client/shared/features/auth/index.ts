// Export context
export * from './context/AuthContext';

// Export types
export type { User, AuthState, AuthContextType } from './context/AuthContext';
export type { UserRole, AuthStatus } from './context/AuthContext';

// Export hooks
export { useAuth } from './context/AuthContext';
export { useAuthForm } from './hooks/useAuthForm';
export { usePermissions } from './hooks/usePermissions';

// Export utilities
export * from './utils/permissions';

// Export components (to be added as they are created)
// export { LoginForm } from './components/LoginForm';
// export { RegisterForm } from './components/RegisterForm';
// export { AuthGuard } from './components/AuthGuard';

// Export utilities (to be added as they are created)
// export { validatePassword } from './utils/validation';

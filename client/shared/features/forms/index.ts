// Export components
export { ContactForm } from './components/ContactForm';

// Export hooks
export { useForm } from './hooks/useForm';

// Export types
export type {
  FormField,
  FormState,
  ValidationSchema,
  SubmitHandler,
  ChangeHandler,
  BlurHandler,
  SubmitEventHandler,
  ResetHandler,
  FormOptions,
  FormResult,
} from './types';

// Export utilities
export {
  required,
  email,
  minLength,
  maxLength,
  pattern,
  number,
  min,
  max,
  url,
  custom,
  compose,
} from './utils/validation';

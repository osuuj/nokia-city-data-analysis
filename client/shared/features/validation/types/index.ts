/**
 * Validation rule types
 */
export type ValidationRule =
  | { required: boolean; message?: string }
  | { minLength: number; message?: string }
  | { maxLength: number; message?: string }
  | { min: number; message?: string }
  | { max: number; message?: string }
  | { pattern: RegExp; message?: string }
  | { email: boolean; message?: string }
  | { url: boolean; message?: string }
  | { custom: (value: string | number | boolean | null) => boolean | string; message?: string };

/**
 * Validation schema type
 */
export type ValidationSchema = Record<string, ValidationRule[]>;

/**
 * Validation errors type
 */
export type ValidationErrors = Record<string, string[]>;

/**
 * Password validation options
 */
export interface PasswordValidationOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
  customRules?: ((password: string) => boolean)[];
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Form validation options
 */
export interface FormValidationOptions<T> {
  initialValues: T;
  validationSchema: ValidationSchema;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Form validation result
 */
export interface FormValidationResult<T> {
  values: T;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  handlers: {
    [K in keyof T]: {
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      ) => void;
      onBlur: (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      ) => void;
    };
  };
  handleSubmit: (e?: React.FormEvent) => void;
  setFieldValue: (field: keyof T, value: string | number | boolean | null) => void;
  setFieldError: (field: keyof T, error: string[]) => void;
  reset: () => void;
  validate: (valuesToValidate?: T) => ValidationErrors;
}

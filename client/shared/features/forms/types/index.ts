/**
 * Form field interface
 */
export interface FormField {
  /** Field value */
  value: string;
  /** Field error message */
  error?: string;
  /** Whether the field has been touched */
  touched: boolean;
  /** Whether the field has been modified */
  dirty: boolean;
}

/**
 * Form state interface
 */
export interface FormState<T extends Record<string, string | number | boolean | null>> {
  /** Form values */
  values: T;
  /** Form errors */
  errors: Partial<Record<keyof T, string>>;
  /** Touched fields */
  touched: Partial<Record<keyof T, boolean>>;
  /** Dirty fields */
  dirty: Partial<Record<keyof T, boolean>>;
  /** Whether the form is submitting */
  isSubmitting: boolean;
  /** Whether the form is valid */
  isValid: boolean;
  /** Whether the form has been submitted */
  isSubmitted: boolean;
  /** Form submission error */
  submitError?: string;
}

/**
 * Form validation schema
 */
export type ValidationSchema<T> = {
  [K in keyof T]?: (value: T[K], values: T) => string | undefined;
};

/**
 * Form submission handler
 */
export type SubmitHandler<T> = (values: T) => Promise<void> | void;

/**
 * Form change handler
 */
export type ChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) => void;

/**
 * Form blur handler
 */
export type BlurHandler = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) => void;

/**
 * Form submit event handler
 */
export type SubmitEventHandler = (e: React.FormEvent<HTMLFormElement>) => void;

/**
 * Form reset handler
 */
export type ResetHandler = () => void;

/**
 * Form options
 */
export interface FormOptions<T extends Record<string, string | number | boolean | null>> {
  /** Initial form values */
  initialValues: T;
  /** Validation schema */
  validationSchema?: ValidationSchema<T>;
  /** Submit handler */
  onSubmit: SubmitHandler<T>;
  /** Whether to validate on change */
  validateOnChange?: boolean;
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
  /** Whether to validate on mount */
  validateOnMount?: boolean;
}

/**
 * Form result
 */
export interface FormResult<T extends Record<string, string | number | boolean | null>> {
  /** Form values */
  values: T;
  /** Form errors */
  errors: Partial<Record<keyof T, string>>;
  /** Touched fields */
  touched: Partial<Record<keyof T, boolean>>;
  /** Dirty fields */
  dirty: Partial<Record<keyof T, boolean>>;
  /** Whether the form is submitting */
  isSubmitting: boolean;
  /** Whether the form is valid */
  isValid: boolean;
  /** Whether the form has been submitted */
  isSubmitted: boolean;
  /** Form submission error */
  submitError?: string;
  /** Change handler */
  handleChange: ChangeHandler;
  /** Blur handler */
  handleBlur: BlurHandler;
  /** Submit handler */
  handleSubmit: SubmitEventHandler;
  /** Reset handler */
  reset: ResetHandler;
  /** Set field value */
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  /** Set field error */
  setFieldError: (field: keyof T, error: string) => void;
  /** Set field touched */
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  /** Set field dirty */
  setFieldDirty: (field: keyof T, dirty: boolean) => void;
  /** Validate form */
  validate: () => Promise<boolean>;
  /** Validate field */
  validateField: (field: keyof T) => Promise<string | undefined>;
}

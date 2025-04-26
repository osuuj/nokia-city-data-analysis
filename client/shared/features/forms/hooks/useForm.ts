'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { type FormOptions, type FormResult, ValidationSchema } from '../types';

/**
 * Custom hook for managing form state and validation
 *
 * @param options Form options
 * @returns Form result
 *
 * @example
 * ```tsx
 * const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
 *   initialValues: { email: '', password: '' },
 *   validationSchema: loginSchema,
 *   onSubmit: async (values) => {
 *     // Handle form submission
 *   },
 * });
 * ```
 */
export function useForm<T extends Record<string, string | number | boolean | null>>(
  options: FormOptions<T>,
): FormResult<T> {
  const {
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnMount = false,
  } = options;

  // Form state
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [dirty, setDirty] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  // Track if component is mounted
  const isMounted = useRef(true);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const validate = useCallback(async () => {
    if (!validationSchema) return true;

    const errors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const field of Object.keys(validationSchema) as Array<keyof T>) {
      try {
        const error = await validationSchema[field]?.(values[field], values);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      } catch (error) {
        errors[field] = 'Validation failed';
        isValid = false;
      }
    }

    setErrors(errors);
    return isValid;
  }, [validationSchema, values]);

  // Validate on mount if needed
  useEffect(() => {
    if (validateOnMount && validationSchema) {
      validate();
    }
  }, [validateOnMount, validationSchema, validate]);

  // Validate a single field
  const validateField = useCallback(
    async (field: keyof T): Promise<string | undefined> => {
      if (!validationSchema || !validationSchema[field]) {
        return undefined;
      }

      try {
        const error = await validationSchema[field]?.(values[field], values);
        return error;
      } catch (error) {
        console.error(`Error validating field ${String(field)}:`, error);
        return 'Validation error';
      }
    },
    [validationSchema, values],
  );

  // Handle field change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const field = name as keyof T;

      if (isMounted.current) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setDirty((prev) => ({ ...prev, [field]: true }));

        if (validateOnChange) {
          validateField(field).then((error) => {
            if (isMounted.current) {
              setErrors((prev) => ({ ...prev, [field]: error }));
            }
          });
        }
      }
    },
    [validateField, validateOnChange],
  );

  // Handle field blur
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      const field = name as keyof T;

      if (isMounted.current) {
        setTouched((prev) => ({ ...prev, [field]: true }));

        if (validateOnBlur) {
          validateField(field).then((error) => {
            if (isMounted.current) {
              setErrors((prev) => ({ ...prev, [field]: error }));
            }
          });
        }
      }
    },
    [validateField, validateOnBlur],
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(undefined);

      try {
        const isValid = await validate();

        if (!isValid) {
          setIsSubmitting(false);
          return;
        }

        await onSubmit(values);
        setIsSubmitted(true);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Form submission failed');
      } finally {
        if (isMounted.current) {
          setIsSubmitting(false);
        }
      }
    },
    [isSubmitting, validate, onSubmit, values],
  );

  // Reset form
  const reset = useCallback(() => {
    if (isMounted.current) {
      setValues(initialValues);
      setErrors({});
      setTouched({});
      setDirty({});
      setIsSubmitting(false);
      setIsSubmitted(false);
      setSubmitError(undefined);
    }
  }, [initialValues]);

  // Set field value
  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    if (isMounted.current) {
      setValues((prev) => ({ ...prev, [field]: value }));
      setDirty((prev) => ({ ...prev, [field]: true }));
    }
  }, []);

  // Set field error
  const setFieldError = useCallback((field: keyof T, error: string) => {
    if (isMounted.current) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }, []);

  // Set field touched
  const setFieldTouched = useCallback((field: keyof T, touched: boolean) => {
    if (isMounted.current) {
      setTouched((prev) => ({ ...prev, [field]: touched }));
    }
  }, []);

  // Set field dirty
  const setFieldDirty = useCallback((field: keyof T, dirty: boolean) => {
    if (isMounted.current) {
      setDirty((prev) => ({ ...prev, [field]: dirty }));
    }
  }, []);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    dirty,
    isSubmitting,
    isValid,
    isSubmitted,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setFieldDirty,
    validate,
    validateField,
  };
}

import { type ChangeEvent, type FocusEvent, useCallback, useState } from 'react';
import type { FormValidationOptions, FormValidationResult, ValidationErrors } from '../types';
import { validateObject } from '../utils/validation';

type FormEventHandlers<T> = {
  [K in keyof T]: {
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  };
};

/**
 * Custom hook for form validation
 */
export function useFormValidation<T extends Record<string, string | number | boolean | null>>(
  options: FormValidationOptions<T>,
): FormValidationResult<T> {
  const { initialValues, validationSchema, onSubmit } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (valuesToValidate: T = values): ValidationErrors => {
      return validateObject(valuesToValidate, validationSchema);
    },
    [validationSchema, values],
  );

  const createChangeHandler = useCallback(
    (field: keyof T) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        const value =
          target instanceof HTMLInputElement && target.type === 'checkbox'
            ? target.checked
            : target.value;

        setValues((prev) => ({ ...prev, [field]: value }));
        setTouched((prev) => ({ ...prev, [field]: true }));

        // Validate only the changed field
        const fieldErrors = validate({ ...values, [field]: value });
        setErrors((prev) => ({
          ...prev,
          [field]: fieldErrors[field as string] || [],
        }));
      },
    [validate, values],
  );

  const createBlurHandler = useCallback(
    (field: keyof T) =>
      (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        // Validate only the blurred field
        const fieldErrors = validate({ ...values, [field]: values[field] });
        setErrors((prev) => ({
          ...prev,
          [field]: fieldErrors[field as string] || [],
        }));
      },
    [validate, values],
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      const validationErrors = validate();
      setErrors(validationErrors);

      // Mark all fields as touched
      setTouched(
        Object.keys(values).reduce(
          (acc, key) => {
            acc[key] = true;
            return acc;
          },
          {} as Record<string, boolean>,
        ),
      );

      if (Object.keys(validationErrors).length === 0) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [validate, values, onSubmit],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((field: keyof T, value: string | number | boolean | null) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string[]) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  // Create event handlers for each field
  const handlers = Object.keys(values).reduce(
    (acc, key) => {
      const field = key as keyof T;
      acc[field] = {
        onChange: createChangeHandler(field),
        onBlur: createBlurHandler(field),
      };
      return acc;
    },
    {} as FormEventHandlers<T>,
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handlers,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    validate,
  };
}

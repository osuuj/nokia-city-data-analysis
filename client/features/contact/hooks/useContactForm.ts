import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { contactApi } from '../data/contactApi';
import type { ContactFormData, ContactFormErrors, ContactFormState } from '../types';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const INITIAL_FORM_DATA: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const INITIAL_STATE: ContactFormState = {
  data: INITIAL_FORM_DATA,
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
  submitError: undefined,
  isSuccess: false,
};

// Validation rules for each field
const VALIDATION_RULES = {
  name: (value: string) => {
    if (!value.trim()) return 'Name is required';
    return '';
  },
  email: (value: string) => {
    if (!value.trim()) return 'Email is required';
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return 'Invalid email address';
    return '';
  },
  subject: (value: string) => {
    if (!value.trim()) return 'Subject is required';
    return '';
  },
  message: (value: string) => {
    if (!value.trim()) return 'Message is required';
    if (value.length < 10) return 'Message must be at least 10 characters long';
    return '';
  },
};

/**
 * Custom hook for managing contact form state and validation
 *
 * Features:
 * - Form state management
 * - Field-level validation with debouncing
 * - Form submission handling
 * - Error handling
 *
 * @returns {Object} Form state and handlers
 */
export const useContactForm = () => {
  const [formState, setFormState] = useState<ContactFormState>(INITIAL_STATE);
  const validationTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  /**
   * Validates a single form field
   * @param field - The field to validate
   * @param value - The field value
   * @returns Error message or empty string if valid
   */
  const validateField = useCallback((field: keyof ContactFormData, value: string): string => {
    const validator = VALIDATION_RULES[field];
    return validator ? validator(value) : '';
  }, []);

  /**
   * Validates form data and returns validation errors
   * @param data - The form data to validate
   * @returns Object containing validation errors
   */
  const validateForm = useCallback((): boolean => {
    try {
      contactFormSchema.parse(formState.data);
      setFormState((prev) => ({
        ...prev,
        errors: {},
      }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ContactFormErrors = {};
        for (const err of error.errors) {
          if (err.path[0]) {
            errors[err.path[0] as keyof ContactFormData] = err.message;
          }
        }
        setFormState((prev) => ({
          ...prev,
          errors,
          isSubmitting: false,
        }));
        return false;
      }
      return false;
    }
  }, [formState.data]);

  /**
   * Debounced validation for a single field
   * @param field - The field to validate
   * @param value - The field value
   */
  const debouncedValidateField = useCallback(
    (field: keyof ContactFormData, value: string) => {
      // Clear any existing timeout for this field
      if (validationTimeouts.current[field]) {
        clearTimeout(validationTimeouts.current[field]);
      }

      // Set a new timeout for validation
      validationTimeouts.current[field] = setTimeout(() => {
        const error = validateField(field, value);
        setFormState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: error || undefined,
          },
        }));
      }, 300); // 300ms debounce delay
    },
    [validateField],
  );

  /**
   * Handles form field changes with debounced validation
   * @param name - The field name
   * @param value - The field value
   */
  const handleChange = useCallback(
    (name: keyof ContactFormData, value: string) => {
      setFormState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [name]: value,
        },
        errors: {
          ...prev.errors,
          [name]: undefined,
        },
        submitError: undefined,
      }));

      // Trigger debounced validation
      debouncedValidateField(name, value);
    },
    [debouncedValidateField],
  );

  /**
   * Handles form submission
   * @returns Promise resolving to boolean indicating success
   */
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      submitError: undefined,
      isSuccess: false,
    }));

    try {
      const response = await contactApi.sendMessage(formState.data);

      if (response.success) {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          isSuccess: true,
          submitError: undefined,
        }));
        return true;
      }
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSuccess: false,
        submitError: response.error || 'An error occurred while submitting the form',
      }));
      return false;
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitError: 'An unexpected error occurred. Please try again.',
        isSuccess: false,
      }));
      return false;
    }
  }, [validateForm, formState.data]);

  /**
   * Resets form state
   */
  const resetForm = useCallback(() => {
    setFormState(INITIAL_STATE);
  }, []);

  // Clean up validation timeouts on unmount
  useEffect(() => {
    return () => {
      for (const timeout of Object.values(validationTimeouts.current)) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return {
    formState,
    handleChange,
    handleSubmit,
    resetForm,
  };
};

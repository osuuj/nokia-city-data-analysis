import { useCallback, useEffect, useRef, useState } from 'react';
import { contactApi } from '../data/contactApi';
import type { ContactFormData, ContactFormErrors, ContactFormState } from '../types';

const INITIAL_FORM_DATA: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const INITIAL_FORM_STATE: ContactFormState = {
  data: INITIAL_FORM_DATA,
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
  submitError: undefined,
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
  const [formState, setFormState] = useState<ContactFormState>(INITIAL_FORM_STATE);
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
  const validateForm = useCallback((data: ContactFormData): ContactFormErrors => {
    const errors: ContactFormErrors = {};

    // Validate each field
    for (const field of Object.keys(data)) {
      const fieldKey = field as keyof ContactFormData;
      const value = data[fieldKey];
      if (!value || value.trim() === '') {
        errors[fieldKey] = `${field} is required`;
      }
    }

    return errors;
  }, []);

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
  const handleSubmit = useCallback(async () => {
    const errors = validateForm(formState.data);

    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({
        ...prev,
        errors,
      }));
      return false;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      submitError: undefined,
    }));

    try {
      const response = await contactApi.submitContactForm(formState.data);

      if (response.success) {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          isSubmitted: true,
          submitError: undefined,
        }));
        return true;
      }
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitError: response.error || 'Failed to send message',
      }));
      return false;
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitError: 'An unexpected error occurred. Please try again.',
      }));
      return false;
    }
  }, [formState.data, validateForm]);

  /**
   * Resets form state
   */
  const resetForm = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
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

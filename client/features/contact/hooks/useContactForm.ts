import { useCallback, useState } from 'react';
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
};

/**
 * Custom hook for managing contact form state and validation
 */
export const useContactForm = () => {
  const [formState, setFormState] = useState<ContactFormState>(INITIAL_FORM_STATE);

  /**
   * Validates form data and returns validation errors
   */
  const validateForm = useCallback((data: ContactFormData): ContactFormErrors => {
    const errors: ContactFormErrors = {};

    if (!data.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      errors.email = 'Invalid email address';
    }

    if (!data.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!data.message.trim()) {
      errors.message = 'Message is required';
    } else if (data.message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    return errors;
  }, []);

  /**
   * Handles form field changes
   */
  const handleChange = useCallback((name: keyof ContactFormData, value: string) => {
    setFormState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value,
      },
      // Clear field-specific error when user starts typing
      errors: {
        ...prev.errors,
        [name]: undefined,
      },
    }));
  }, []);

  /**
   * Handles form submission
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
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
      }));

      return true;
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitError: 'Failed to send message. Please try again.',
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

  return {
    formState,
    handleChange,
    handleSubmit,
    resetForm,
  };
};

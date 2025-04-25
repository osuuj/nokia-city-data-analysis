/**
 * Contact Feature Types
 *
 * This file exports all types for the contact feature.
 */

/**
 * Contact form data interface
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Contact form validation errors interface
 */
export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/**
 * Contact form state interface
 */
export interface ContactFormState {
  data: ContactFormData;
  errors: ContactFormErrors;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError?: string;
}

/**
 * Contact API response interface
 */
export interface ContactApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

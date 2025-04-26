import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import React from 'react';
import { useContactForm } from '../hooks/useContactForm';
import type { ContactFormData } from '../types';

/**
 * ContactForm Component
 *
 * A reusable form component for collecting contact information from users.
 * Implements form validation, error handling, and accessibility features.
 *
 * @example
 * ```tsx
 * import { ContactForm } from '../components';
 *
 * const ContactPage = () => {
 *   return (
 *     <div>
 *       <h1>Contact Us</h1>
 *       <ContactForm />
 *     </div>
 *   );
 * };
 * ```
 *
 * @returns {JSX.Element} A form component for collecting contact information
 */
const ContactFormComponent: React.FC = () => {
  const { formState, handleChange, handleSubmit, resetForm } = useContactForm();

  /**
   * Handles form submission
   * Prevents default form behavior, submits the form data,
   * and shows success or error messages
   *
   * @param {React.FormEvent} e - The form submission event
   */
  const onSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await handleSubmit();

      if (success) {
        // Show success message
        alert('Message sent! We will get back to you soon.');
        resetForm();
      } else if (formState.submitError) {
        // Show error message
        alert(`Error: ${formState.submitError}`);
      }
    },
    [handleSubmit, resetForm, formState.submitError],
  );

  /**
   * Handles input field changes
   * Updates form state with the new field value
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event
   */
  const handleFieldChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleChange(e.target.name as keyof ContactFormData, e.target.value);
    },
    [handleChange],
  );

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-2xl space-y-4"
      aria-label="Contact form"
      noValidate
    >
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <Input
          id="name"
          name="name"
          value={formState.data.name}
          onChange={handleFieldChange}
          placeholder="Your name"
          disabled={formState.isSubmitting}
          className={`${formState.errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          aria-required="true"
          aria-invalid={!!formState.errors.name}
          aria-describedby={formState.errors.name ? 'name-error' : undefined}
        />
        {formState.errors.name && (
          <div
            id="name-error"
            className="text-sm text-red-500 dark:text-red-400"
            aria-live="polite"
          >
            {formState.errors.name}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formState.data.email}
          onChange={handleFieldChange}
          placeholder="your.email@example.com"
          disabled={formState.isSubmitting}
          className={`${formState.errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          aria-required="true"
          aria-invalid={!!formState.errors.email}
          aria-describedby={formState.errors.email ? 'email-error' : undefined}
          autoComplete="email"
        />
        {formState.errors.email && (
          <div
            id="email-error"
            className="text-sm text-red-500 dark:text-red-400"
            aria-live="polite"
          >
            {formState.errors.email}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Subject
        </label>
        <Input
          id="subject"
          name="subject"
          value={formState.data.subject}
          onChange={handleFieldChange}
          placeholder="Message subject"
          disabled={formState.isSubmitting}
          className={`${formState.errors.subject ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          aria-required="true"
          aria-invalid={!!formState.errors.subject}
          aria-describedby={formState.errors.subject ? 'subject-error' : undefined}
          autoComplete="off"
        />
        {formState.errors.subject && (
          <div
            id="subject-error"
            className="text-sm text-red-500 dark:text-red-400"
            aria-live="polite"
          >
            {formState.errors.subject}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          value={formState.data.message}
          onChange={handleFieldChange}
          placeholder="Your message"
          rows={6}
          disabled={formState.isSubmitting}
          className={`${formState.errors.message ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          aria-required="true"
          aria-invalid={!!formState.errors.message}
          aria-describedby={formState.errors.message ? 'message-error' : undefined}
          autoComplete="off"
        />
        {formState.errors.message && (
          <div
            id="message-error"
            className="text-sm text-red-500 dark:text-red-400"
            aria-live="polite"
          >
            {formState.errors.message}
          </div>
        )}
      </div>

      {formState.submitError && (
        <div
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
          aria-live="assertive"
        >
          <div className="text-sm text-red-700 dark:text-red-300">{formState.submitError}</div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
        disabled={formState.isSubmitting}
        aria-busy={formState.isSubmitting}
      >
        {formState.isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};

// Export memoized component to prevent unnecessary re-renders
export const ContactForm = React.memo(ContactFormComponent);

'use client';

import React, { type ReactNode } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import type { FormValidationOptions, FormValidationResult } from '../types';

export interface FormValidationProps<T extends Record<string, string | number | boolean | null>> {
  children: (props: FormValidationResult<T>) => ReactNode;
  options: FormValidationOptions<T>;
}

/**
 * FormValidation component that provides form validation functionality
 *
 * @example
 * ```tsx
 * <FormValidation
 *   options={{
 *     initialValues: { name: '', email: '' },
 *     validationSchema: {
 *       name: [{ required: true, message: 'Name is required' }],
 *       email: [
 *         { required: true, message: 'Email is required' },
 *         { email: true, message: 'Invalid email format' }
 *       ]
 *     },
 *     onSubmit: (values) => console.log(values)
 *   }}
 * >
 *   {({ values, errors, handlers, handleSubmit }) => (
 *     <form onSubmit={handleSubmit}>
 *       <Input
 *         name="name"
 *         value={values.name}
 *         onChange={handlers.name.onChange}
 *         onBlur={handlers.name.onBlur}
 *         errorMessage={errors.name?.[0]}
 *       />
 *       <Input
 *         name="email"
 *         value={values.email}
 *         onChange={handlers.email.onChange}
 *         onBlur={handlers.email.onBlur}
 *         errorMessage={errors.email?.[0]}
 *       />
 *       <Button type="submit">Submit</Button>
 *     </form>
 *   )}
 * </FormValidation>
 * ```
 */
export function FormValidation<T extends Record<string, string | number | boolean | null>>({
  children,
  options,
}: FormValidationProps<T>) {
  const formValidation = useFormValidation<T>(options);

  return <>{children(formValidation)}</>;
}

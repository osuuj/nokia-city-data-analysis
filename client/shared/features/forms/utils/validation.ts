/**
 * Validation utility functions for forms
 */

/**
 * Required field validator
 *
 * @param value Field value
 * @param message Error message
 * @returns Error message if validation fails, undefined otherwise
 */
export function required(
  value: string | number | boolean | null | undefined,
  message = 'This field is required',
): string | undefined {
  if (value === undefined || value === null || value === '') {
    return message;
  }
  return undefined;
}

/**
 * Email validator
 *
 * @param value Field value
 * @param message Error message
 * @returns Error message if validation fails, undefined otherwise
 */
export function email(value: string, message = 'Invalid email address'): string | undefined {
  if (!value) {
    return undefined;
  }

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return message;
  }

  return undefined;
}

/**
 * Min length validator
 *
 * @param value Field value
 * @param min Minimum length
 * @param message Error message
 * @returns Error message if validation fails, undefined otherwise
 */
export function minLength(
  value: string | Array<unknown>,
  min: number,
  message = `Must be at least ${min} characters`,
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (value.length < min) {
    return message;
  }

  return undefined;
}

/**
 * Max length validator
 *
 * @param value Field value
 * @param max Maximum length
 * @param message Error message
 * @returns Error message if validation fails, undefined otherwise
 */
export function maxLength(
  value: string | Array<unknown>,
  max: number,
  message = `Must be no more than ${max} characters`,
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (value.length > max) {
    return message;
  }

  return undefined;
}

/**
 * Pattern validator
 *
 * @param value Field value
 * @param pattern Regular expression
 * @param message Error message
 * @returns Error message if validation fails, undefined otherwise
 */
export function pattern(
  value: string,
  pattern: RegExp,
  message = 'Invalid format',
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (!pattern.test(value)) {
    return message;
  }

  return undefined;
}

/**
 * Number validator
 *
 * @param value Field value
 * @param message Error message
 * @returns Error message if validation fails, undefined otherwise
 */
export function number(
  value: string | number | null | undefined,
  message = 'Must be a number',
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (Number.isNaN(Number(value))) {
    return message;
  }

  return undefined;
}

/**
 * Min value validator
 *
 * @param value Field value
 * @param min Minimum value
 * @param message Error message
 * @returns Error message if validation fails, undefined otherwise
 */
export function min(
  value: string | number | null | undefined,
  min: number,
  message = `Must be at least ${min}`,
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (Number(value) < min) {
    return message;
  }

  return undefined;
}

/**
 * Max value validator
 *
 * @param value Field value
 * @param max Maximum value
 * @param message Error message
 * @returns Error message if validation fails, undefined otherwise
 */
export function max(
  value: string | number | null | undefined,
  max: number,
  message = `Must be no more than ${max}`,
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (Number(value) > max) {
    return message;
  }

  return undefined;
}

/**
 * URL validator
 *
 * @param value Field value
 * @param message Error message
 * @returns Error message if validation fails, undefined otherwise
 */
export function url(
  value: string | null | undefined,
  message = 'Must be a valid URL',
): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    new URL(value);
    return undefined;
  } catch (error) {
    return message;
  }
}

/**
 * Custom validator
 *
 * @param value Field value
 * @param validator Custom validation function
 * @param message Error message
 * @returns Error message if validation fails, undefined otherwise
 */
export function custom<T>(
  value: T,
  validator: (value: T) => string | undefined,
  message = 'Invalid value',
): string | undefined {
  if (!value) {
    return undefined;
  }

  return validator(value) ? undefined : message;
}

/**
 * Compose multiple validators
 *
 * @param validators Array of validators
 * @returns Composed validator
 */
export function compose<T>(...validators: Array<(value: T) => string | undefined>) {
  return (value: T): string | undefined => {
    for (const validator of validators) {
      const result = validator(value);
      if (result) {
        return result;
      }
    }
    return undefined;
  };
}

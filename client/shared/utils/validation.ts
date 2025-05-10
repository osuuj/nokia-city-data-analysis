/**
 * Shared validation utilities
 *
 * A collection of functions for validating different types of data.
 */

/**
 * Validate if a value is a valid email address
 * @param email Email address to validate
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate if a value is a non-empty string
 * @param value Value to validate
 */
export function isNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate if a value is a valid number
 * @param value Value to validate
 */
export function isValidNumber(value: unknown): boolean {
  if (typeof value === 'number') return !Number.isNaN(value);
  if (typeof value === 'string') return !Number.isNaN(Number(value));
  return false;
}

/**
 * Validate if a value is a valid integer
 * @param value Value to validate
 */
export function isValidInteger(value: unknown): boolean {
  if (typeof value === 'number') return Number.isInteger(value);
  if (typeof value === 'string') {
    const num = Number(value);
    return !Number.isNaN(num) && Number.isInteger(num);
  }
  return false;
}

/**
 * Validate if a date string is in a valid ISO format (YYYY-MM-DD)
 * @param dateStr Date string to validate
 */
export function isValidISODate(dateStr: string): boolean {
  if (typeof dateStr !== 'string') return false;

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateStr)) return false;

  const date = new Date(dateStr);
  return date instanceof Date && !Number.isNaN(date.getTime());
}

/**
 * Validate if a URL is valid
 * @param url URL to validate
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Type guard to validate an object has required properties
 * @param obj Object to validate
 * @param props Array of required property names
 */
export function hasRequiredProps<T extends object>(obj: unknown, props: string[]): obj is T {
  if (!obj || typeof obj !== 'object') return false;
  return props.every((prop) => prop in obj);
}

/**
 * Check if value is within a valid range
 * @param value Value to check
 * @param min Minimum allowed value (inclusive)
 * @param max Maximum allowed value (inclusive)
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate if input is an array of a specific type
 * @param value Value to validate
 * @param validator Function to validate each array item
 */
export function isArrayOf<T>(
  value: unknown,
  validator: (item: unknown) => item is T,
): value is T[] {
  return Array.isArray(value) && value.every(validator);
}

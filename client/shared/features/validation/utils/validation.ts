import type {
  PasswordValidationOptions,
  PasswordValidationResult,
  ValidationErrors,
  ValidationRule,
} from '../types';

/**
 * Validates a value against a set of validation rules
 */
export const validateValue = (
  value: string | number | boolean | null | undefined,
  rules: ValidationRule[],
): string[] => {
  const errors: string[] = [];

  for (const rule of rules) {
    if ('required' in rule && rule.required && !value) {
      errors.push(rule.message || 'This field is required');
      continue;
    }

    if (!value) continue;

    if ('minLength' in rule && value.length < rule.minLength) {
      errors.push(rule.message || `Minimum length is ${rule.minLength}`);
    }

    if ('maxLength' in rule && value.length > rule.maxLength) {
      errors.push(rule.message || `Maximum length is ${rule.maxLength}`);
    }

    if ('min' in rule && value < rule.min) {
      errors.push(rule.message || `Minimum value is ${rule.min}`);
    }

    if ('max' in rule && value > rule.max) {
      errors.push(rule.message || `Maximum value is ${rule.max}`);
    }

    if ('pattern' in rule && !rule.pattern.test(value)) {
      errors.push(rule.message || 'Invalid format');
    }

    if ('email' in rule && rule.email && !isValidEmail(value)) {
      errors.push(rule.message || 'Invalid email address');
    }

    if ('url' in rule && rule.url && !isValidUrl(value)) {
      errors.push(rule.message || 'Invalid URL');
    }

    if ('custom' in rule) {
      const result = rule.custom(value);
      if (typeof result === 'string') {
        errors.push(result);
      } else if (!result) {
        errors.push(rule.message || 'Invalid value');
      }
    }
  }

  return errors;
};

/**
 * Validates an object against a validation schema
 */
export const validateObject = <T extends Record<string, string | number | boolean | null>>(
  values: T,
  schema: Record<string, ValidationRule[]>,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const fieldErrors = validateValue(values[field], rules);
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  }

  return errors;
};

/**
 * Validates an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates a password against specified criteria
 */
export const validatePassword = (
  password: string,
  options: PasswordValidationOptions = {},
): PasswordValidationResult => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecialChar = true,
    customRules = [],
  } = options;

  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requireNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  for (const rule of customRules) {
    if (!rule(password)) {
      errors.push('Password does not meet custom requirements');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

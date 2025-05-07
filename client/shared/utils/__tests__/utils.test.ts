/**
 * Tests for shared utility functions
 */

import {
  capitalizeFirst,
  formatCompactNumber,
  formatDate,
  formatISODate,
  formatLabel,
  formatNumber,
  formatPercentage,
  truncateString,
} from '../formatting';

import {
  hasRequiredProps,
  isArrayOf,
  isInRange,
  isNonEmptyString,
  isValidEmail,
  isValidISODate,
  isValidInteger,
  isValidNumber,
  isValidURL,
} from '../validation';

import {
  average,
  calculatePercentage,
  clamp,
  mapRange,
  median,
  randomNumber,
  round,
  sum,
} from '../math';

// Formatting Tests
describe('Formatting Utilities', () => {
  // Number formatting
  test('formatNumber formats numbers with thousands separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1234567.89)).toBe('1,234,567.89');
  });

  test('formatCompactNumber formats numbers in compact form', () => {
    expect(formatCompactNumber(1000)).toBe('1K');
    expect(formatCompactNumber(1500000)).toBe('1.5M');
  });

  test('formatPercentage formats numbers as percentages', () => {
    expect(formatPercentage(0.5)).toBe('50%');
    expect(formatPercentage(0.123, 1)).toBe('12.3%');
  });

  // Date formatting
  test('formatDate formats dates with default options', () => {
    const date = new Date('2023-01-15');
    expect(formatDate(date)).toMatch(/Jan 15, 2023/);
  });

  test('formatISODate formats dates in ISO format', () => {
    const date = new Date('2023-01-15');
    expect(formatISODate(date)).toBe('2023-01-15');
  });

  // String formatting
  test('capitalizeFirst capitalizes the first letter of a string', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
    expect(capitalizeFirst('WORLD')).toBe('WORLD');
  });

  test('formatLabel formats labels from kebab-case and snake_case', () => {
    expect(formatLabel('hello-world')).toBe('Hello World');
    expect(formatLabel('hello_world')).toBe('Hello World');
  });

  test('truncateString truncates strings with ellipsis', () => {
    expect(truncateString('Hello World', 5)).toBe('Hello...');
    expect(truncateString('Short', 10)).toBe('Short');
  });
});

// Validation Tests
describe('Validation Utilities', () => {
  test('isValidEmail validates email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });

  test('isNonEmptyString validates non-empty strings', () => {
    expect(isNonEmptyString('hello')).toBe(true);
    expect(isNonEmptyString('')).toBe(false);
    expect(isNonEmptyString(123)).toBe(false);
  });

  test('isValidNumber validates numbers', () => {
    expect(isValidNumber(123)).toBe(true);
    expect(isValidNumber('123')).toBe(true);
    expect(isValidNumber('abc')).toBe(false);
  });

  test('isValidInteger validates integers', () => {
    expect(isValidInteger(123)).toBe(true);
    expect(isValidInteger(123.45)).toBe(false);
    expect(isValidInteger('123')).toBe(true);
  });

  test('isValidISODate validates ISO date strings', () => {
    expect(isValidISODate('2023-01-15')).toBe(true);
    expect(isValidISODate('2023/01/15')).toBe(false);
  });

  test('isValidURL validates URLs', () => {
    expect(isValidURL('https://example.com')).toBe(true);
    expect(isValidURL('invalid')).toBe(false);
  });

  test('hasRequiredProps validates object properties', () => {
    expect(hasRequiredProps({ name: 'Test', age: 30 }, ['name'])).toBe(true);
    expect(hasRequiredProps({ name: 'Test' }, ['age'])).toBe(false);
  });

  test('isInRange validates numbers in range', () => {
    expect(isInRange(5, 0, 10)).toBe(true);
    expect(isInRange(15, 0, 10)).toBe(false);
  });

  test('isArrayOf validates arrays of specific types', () => {
    const isString = (val: unknown): val is string => typeof val === 'string';
    expect(isArrayOf(['a', 'b', 'c'], isString)).toBe(true);
    expect(isArrayOf(['a', 'b', 123], isString)).toBe(false);
  });
});

// Math Tests
describe('Math Utilities', () => {
  test('clamp restricts values to a range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test('calculatePercentage calculates percentage values', () => {
    expect(calculatePercentage(50, 200)).toBe(25);
    expect(calculatePercentage(0, 200)).toBe(0);
  });

  test('round rounds numbers to specified decimal places', () => {
    expect(round(123.456)).toBe(123);
    expect(round(123.456, 2)).toBe(123.46);
  });

  test('average calculates the average of numbers', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3);
    expect(average([])).toBe(0);
  });

  test('sum calculates the sum of numbers', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15);
    expect(sum([])).toBe(0);
  });

  test('median calculates the median of numbers', () => {
    expect(median([1, 3, 5, 7, 9])).toBe(5);
    expect(median([1, 3, 5, 7])).toBe(4);
  });

  test('mapRange maps values from one range to another', () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
    expect(mapRange(0, -10, 10, 0, 100)).toBe(50);
  });
});

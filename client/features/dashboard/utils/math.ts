/**
 * Math and number utility functions for dashboard components
 */

/**
 * @function clampValue
 *
 * Restricts a number explicitly within a specified range.
 *
 * @param {number} value - Number explicitly to clamp.
 * @param {number} min - Minimum allowed value explicitly.
 * @param {number} max - Maximum allowed value explicitly.
 * @returns {number} Explicitly clamped number.
 *
 * @example
 * clampValue(5, 1, 10);    // 5
 * clampValue(-3, 0, 10);   // 0
 * clampValue(20, 0, 15);   // 15
 */
export function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * @function roundToDecimalPlaces
 *
 * Rounds a number to the specified number of decimal places.
 *
 * @param {number} value - The number to round.
 * @param {number} decimalPlaces - The number of decimal places.
 * @returns {number} The rounded number.
 *
 * @example
 * roundToDecimalPlaces(3.14159, 2);  // 3.14
 * roundToDecimalPlaces(10.999, 1);   // 11.0
 */
export function roundToDecimalPlaces(value: number, decimalPlaces: number): number {
  const factor = 10 ** decimalPlaces;
  return Math.round(value * factor) / factor;
}

/**
 * @function formatPercentage
 *
 * Formats a number as a percentage string.
 *
 * @param {number} value - The number to format (0.1 = 10%).
 * @param {number} decimalPlaces - The number of decimal places.
 * @returns {string} The formatted percentage string.
 *
 * @example
 * formatPercentage(0.1234, 1);    // "12.3%"
 * formatPercentage(1.5, 0);       // "150%"
 */
export function formatPercentage(value: number, decimalPlaces = 0): string {
  return `${roundToDecimalPlaces(value * 100, decimalPlaces)}%`;
}

/**
 * @function calculatePercentChange
 *
 * Calculates the percentage change between two values.
 *
 * @param {number} oldValue - The original value.
 * @param {number} newValue - The new value.
 * @returns {number} The percentage change.
 *
 * @example
 * calculatePercentChange(100, 110);  // 0.1 (10% increase)
 * calculatePercentChange(100, 90);   // -0.1 (10% decrease)
 */
export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 1;
  return (newValue - oldValue) / Math.abs(oldValue);
}

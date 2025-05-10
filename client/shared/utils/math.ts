/**
 * Shared math utilities
 *
 * A collection of functions for common mathematical operations.
 */

/**
 * Clamp a value between a minimum and maximum
 * @param value Value to clamp
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate a percentage value
 * @param value Current value
 * @param total Total value
 * @param decimals Number of decimal places (default: 2)
 */
export function calculatePercentage(value: number, total: number, decimals = 2): number {
  if (total === 0) return 0;
  const percentage = (value / total) * 100;
  return Number(percentage.toFixed(decimals));
}

/**
 * Generate a random number between min and max (inclusive)
 * @param min Minimum value
 * @param max Maximum value
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Round a number to a specified number of decimal places
 * @param value Number to round
 * @param decimals Number of decimal places (default: 0)
 */
export function round(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Calculate the average of an array of numbers
 * @param values Array of numbers
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate the sum of an array of numbers
 * @param values Array of numbers
 */
export function sum(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

/**
 * Calculate the median of an array of numbers
 * @param values Array of numbers
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

/**
 * Map a value from one range to another
 * @param value Value to map
 * @param fromMin Minimum of original range
 * @param fromMax Maximum of original range
 * @param toMin Minimum of target range
 * @param toMax Maximum of target range
 */
export function mapRange(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
): number {
  // Calculate where in the first range the value is
  const ratio = (value - fromMin) / (fromMax - fromMin);
  // Project that position onto the second range
  return toMin + ratio * (toMax - toMin);
}

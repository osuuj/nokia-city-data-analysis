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

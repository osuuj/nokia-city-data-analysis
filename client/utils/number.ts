/**
 * Restricts a number to be within a specified range.
 *
 * @param value - The number to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The clamped value
 *
 * @example
 * clampValue(5, 1, 10);    // 5
 * clampValue(-3, 0, 10);   // 0
 * clampValue(20, 0, 15);   // 15
 */
export function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

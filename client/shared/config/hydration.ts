/**
 * Utilities to help with React hydration mismatches
 */

/**
 * Removes duplicate CSS classes to prevent hydration mismatches
 * @param classNames String of CSS class names potentially containing duplicates
 * @returns String with deduplicated class names
 */
export function dedupeClasses(classNames: string): string {
  if (!classNames) return '';

  // Split by whitespace and filter out duplicates
  const classSet = new Set(classNames.split(/\s+/).filter(Boolean));
  return Array.from(classSet).join(' ');
}

/**
 * Configuration for suppressing harmless hydration warnings
 * These are enabled by default in development mode
 */
export const hydrationConfig = {
  /**
   * Whether to suppress hydration warnings in the console
   * Useful in development to reduce noise
   */
  suppressWarnings: true,

  /**
   * Whether to throw errors on hydration mismatches
   * Set to false in development for better experience
   */
  throwOnHydrationMismatch: process.env.NODE_ENV === 'production',
};

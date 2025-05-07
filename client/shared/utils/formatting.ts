/**
 * Shared formatting utilities
 *
 * A collection of functions for formatting numbers, dates, and strings.
 */

/**
 * Format a number with thousands separators
 * @param value Number to format
 * @param locale Locale to use for formatting (default: 'en-US')
 */
export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format a number as a compact representation (e.g., 1.2k, 5.3M)
 * @param value Number to format
 * @param locale Locale to use for formatting (default: 'en-US')
 */
export function formatCompactNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}

/**
 * Format a number as a percentage
 * @param value Number to format as percentage (0-1)
 * @param decimals Number of decimal places (default: 0)
 * @param locale Locale to use for formatting (default: 'en-US')
 */
export function formatPercentage(value: number, decimals = 0, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a date according to specified format
 * @param date Date to format
 * @param options Date formatting options
 * @param locale Locale to use for formatting (default: 'en-US')
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  locale = 'en-US',
): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a date to ISO format (YYYY-MM-DD)
 * @param date Date to format
 */
export function formatISODate(date: Date | string | number): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);
  return dateObj.toISOString().split('T')[0];
}

/**
 * Capitalize the first letter of a string
 * @param value String to capitalize
 */
export function capitalizeFirst(value: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Format a label by converting from kebab-case or snake_case to Title Case
 * @param value String to format
 */
export function formatLabel(value: string): string {
  if (!value) return '';
  return value
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
    .split(' ')
    .map((word) => capitalizeFirst(word))
    .join(' ');
}

/**
 * Truncate a string to a maximum length and add ellipsis if needed
 * @param value String to truncate
 * @param maxLength Maximum length before truncation
 * @param ellipsis String to append when truncated (default: '...')
 */
export function truncateString(value: string, maxLength: number, ellipsis = '...'): string {
  if (!value || value.length <= maxLength) return value;
  return value.slice(0, maxLength) + ellipsis;
}

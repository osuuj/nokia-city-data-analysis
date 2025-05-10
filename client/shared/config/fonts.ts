import { Fira_Code as FontMono, Inter as FontSans } from 'next/font/google';

/**
 * Inter font configuration for sans-serif typography.
 * Sets `--font-sans` as the CSS variable.
 *
 * Optimized with:
 * - display: 'swap' for better performance
 * - preload: true to prioritize loading
 * - fallback: system fonts for better initial rendering
 */
export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  adjustFontFallback: true, // Automatically adjust metrics to match the fallback font
});

/**
 * Fira Code font configuration for monospaced typography.
 * Sets `--font-mono` as the CSS variable.
 *
 * Optimized with:
 * - display: 'swap' for better performance
 * - preload: true to prioritize loading
 * - fallback: system fonts for better initial rendering
 */
export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
  fallback: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
  adjustFontFallback: true, // Automatically adjust metrics to match the fallback font
});

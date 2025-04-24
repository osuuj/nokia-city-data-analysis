import { Fira_Code as FontMono, Inter as FontSans } from 'next/font/google';

/**
 * Inter font configuration for sans-serif typography.
 * Sets `--font-sans` as the CSS variable.
 */
export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

/**
 * Fira Code font configuration for monospaced typography.
 * Sets `--font-mono` as the CSS variable.
 */
export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

/**
 * Theme and color utilities for dashboard components
 */

/**
 * Industry color mapping for both light and dark themes
 */
export const industryColors: Record<string, { light: string; dark: string }> = {
  technology: { light: '#4361ee', dark: '#4cc9f0' },
  healthcare: { light: '#f72585', dark: '#ff85a1' },
  education: { light: '#7209b7', dark: '#9d4edd' },
  manufacturing: { light: '#3a0ca3', dark: '#7678ed' },
  retail: { light: '#ff9e00', dark: '#ffca3a' },
  finance: { light: '#38b000', dark: '#80ed99' },
  construction: { light: '#ff5400', dark: '#ffaa00' },
  professional: { light: '#9d4edd', dark: '#c77dff' },
  other: { light: '#4895ef', dark: '#a5c9f1' },
};

/**
 * Normalizes an industry name to create a consistent key for lookups
 *
 * @param name - The industry name to normalize
 * @returns A normalized key for the industry
 *
 * @example
 * getIndustryKeyFromName('Information Technology'); // "informationtechnology"
 * getIndustryKeyFromName('Health Care'); // "healthcare"
 */
export function getIndustryKeyFromName(name: string): string | undefined {
  if (!name) return undefined;
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Gets a standard industry name from a potentially varied input
 *
 * @param name - The input industry name
 * @returns A standardized industry name
 */
export function getStandardIndustryName(name: string): string {
  const nameMap = new Map<string, string>([
    ['technology', 'Technology'],
    ['healthcare', 'Healthcare'],
    ['education', 'Education'],
    ['manufacturing', 'Manufacturing'],
    ['retail', 'Retail'],
    ['finance', 'Finance'],
    ['construction', 'Construction'],
    ['professional', 'Professional Services'],
    ['other', 'Other'],
  ]);

  const key = getIndustryKeyFromName(name);
  return key ? nameMap.get(key) || name : 'Other';
}

/**
 * Gets the appropriate color for an industry based on the current theme
 *
 * @param name - The industry name
 * @param theme - The current theme (light or dark)
 * @returns The appropriate color for the industry in the current theme
 */
export function getThemedIndustryColor(name: string, theme: 'light' | 'dark' = 'light'): string {
  const key = getIndustryKeyFromName(name) || 'other';
  return industryColors[key]?.[theme] || industryColors.other[theme];
}

/**
 * Determines if an industry should be grouped into "Other" category
 *
 * @param name - The industry name to check
 * @returns True if the industry should be grouped into "Other"
 */
export function isOtherIndustry(name: string): boolean {
  const potentialOthers = ['Other', 'Miscellaneous', 'Various', 'Unknown', 'Not Specified'];
  return potentialOthers.some((term) => name.toLowerCase().includes(term.toLowerCase()));
}

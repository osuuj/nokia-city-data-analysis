import { TECH_CATEGORIES } from '../data/techStack';
import { ProjectCategory } from '../types';

/**
 * Mapping of project categories to their corresponding icons
 */
export const CATEGORY_ICONS: Record<string, string> = {
  [ProjectCategory.Web]: 'lucide:globe',
  [ProjectCategory.Mobile]: 'lucide:smartphone',
  [ProjectCategory.AI]: 'lucide:brain',
  [ProjectCategory.Desktop]: 'lucide:monitor',
  [ProjectCategory.Other]: 'lucide:folder',
  design: 'lucide:palette',
  etl: 'carbon:data-refinery',
  api: 'mdi:api',
  map: 'lucide:map',
  analytics: 'lucide:bar-chart-2',
};

/**
 * Mapping of project categories to their corresponding colors
 */
export const CATEGORY_COLORS: Record<
  string,
  'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'
> = {
  [ProjectCategory.Web]: 'primary',
  [ProjectCategory.Mobile]: 'secondary',
  [ProjectCategory.AI]: 'success',
  [ProjectCategory.Desktop]: 'warning',
  [ProjectCategory.Other]: 'default',
  design: 'warning',
  etl: 'warning',
  api: 'secondary',
  map: 'secondary',
  analytics: 'danger',
};

/**
 * Get the icon identifier for a project category
 */
export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || 'lucide:folder';
}

/**
 * Get the color for a project category
 */
export function getCategoryColor(
  category: string,
): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default' {
  return CATEGORY_COLORS[category] || 'default';
}

/**
 * Group technologies by category
 */
export function groupTechByCategory(technologies: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  for (const tech of technologies) {
    const category = getCategoryForTech(tech);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(tech);
  }

  return grouped;
}

/**
 * Get the category for a technology
 */
export function getCategoryForTech(tech: string): string {
  for (const [category, list] of Object.entries(TECH_CATEGORIES)) {
    if (list.includes(tech)) return category;
  }
  return 'other';
}

/**
 * Format a category name for display
 */
export function formatCategoryName(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

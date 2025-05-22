'use client';

import type { ResourceCategoryData } from '@/features/resources/types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { ResourceCard } from './ResourceCard';

interface CategoryAccordionItemProps {
  /** The category data to display */
  category: ResourceCategoryData;
  /** Whether this category should be initially expanded */
  defaultExpanded?: boolean;
  /** Optional class name to apply to the component */
  className?: string;
}

/**
 * CategoryAccordionItem
 *
 * A custom accordion item for displaying resource categories.
 * Visually matches HeroUI Accordion but avoids runtime errors.
 *
 * @example
 * <CategoryAccordionItem
 *   category={category}
 *   defaultExpanded={category.id === 'getting-started'}
 * />
 */
export const CategoryAccordionItem = ({
  category,
  defaultExpanded = false,
  className = '',
}: CategoryAccordionItemProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hasLoaded, setHasLoaded] = useState(isExpanded);

  return (
    <div
      className={`border border-default-200 dark:border-default-100/20 rounded-large overflow-hidden mb-4 bg-content1 shadow-sm ${className}`}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between p-6 text-left bg-default-50 dark:bg-default-100/5 hover:bg-default-100 dark:hover:bg-default-100/10 transition-colors"
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!hasLoaded) setHasLoaded(true);
        }}
        aria-expanded={isExpanded}
        aria-controls={`category-${category.id}`}
      >
        <div className="flex items-center gap-3">
          {/* Icon with fallback */}
          <div className="text-2xl text-primary w-6 h-6 flex items-center justify-center">
            {category.icon && <Icon icon={category.icon} />}
          </div>
          <h3 className="text-xl font-medium">{category.title}</h3>
          {category.description && (
            <p className="text-sm text-default-500 hidden sm:block ml-2 truncate max-w-[300px]">
              {category.description}
            </p>
          )}
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-default-100 dark:bg-default-100/20">
          {isExpanded ? (
            <ChevronUpIcon
              className="w-5 h-5 text-default-700 dark:text-default-500"
              aria-hidden="true"
            />
          ) : (
            <ChevronDownIcon
              className="w-5 h-5 text-default-700 dark:text-default-500"
              aria-hidden="true"
            />
          )}
        </div>
      </button>

      {isExpanded && (
        <section
          id={`category-${category.id}`}
          className="p-6 pt-1 transition-all"
          aria-labelledby={`category-header-${category.id}`}
        >
          <h3 id={`category-header-${category.id}`} className="sr-only">
            {category.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
            {hasLoaded &&
              category.resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';
import type { ResourceCategoryData } from '../types';

interface ResourceAccordionProps {
  category: ResourceCategoryData;
}

/**
 * ResourceAccordion Component
 *
 * Displays a collapsible accordion with resource category information and
 * a list of resources within that category.
 *
 * @example
 * <ResourceAccordion
 *   category={{
 *     id: 'guides',
 *     title: 'Guides & Tutorials',
 *     description: 'In-depth guides and tutorials',
 *     icon: 'lucide:book',
 *     resources: [...]
 *   }}
 * />
 */
export const ResourceAccordion = memo(function ResourceAccordion({
  category,
}: ResourceAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div className="border rounded-lg shadow-sm bg-background">
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
        aria-controls={`category-${category.id}`}
      >
        <div className="flex items-center space-x-3">
          <Icon icon={category.icon} className="w-6 h-6 text-primary-600" />
          <div>
            <h2 className="text-xl font-semibold">{category.title}</h2>
            <p className="text-sm text-default-600">{category.description}</p>
          </div>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isExpanded && (
        <div
          id={`category-${category.id}`}
          className="p-4 pt-0"
          aria-labelledby={`category-header-${category.id}`}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {category.resources.map((resource) => (
              <Link
                key={resource.id}
                href={resource.link}
                className="block p-4 rounded-lg border hover:border-primary-500 hover:shadow-md transition-all bg-background"
              >
                <div className="flex items-start space-x-3">
                  <Icon icon={resource.icon} className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-default-600 mt-1">{resource.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        {resource.type}
                      </span>
                      {resource.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-default-100 text-default-700 dark:bg-default-800 dark:text-default-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

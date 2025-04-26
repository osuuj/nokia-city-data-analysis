import type { ResourceCategoryData } from '../types';

/**
 * Props for the ResourcesContent component
 */
interface ResourcesContentProps {
  /**
   * Array of resource categories to display
   */
  categories: ResourceCategoryData[];
}

/**
 * ResourcesContent component
 *
 * Displays a grid of resource categories, each containing a list of resources.
 * The component includes a gradient background and responsive layout.
 *
 * @param {ResourceCategoryData[]} categories - Array of resource categories to display
 *
 * @example
 * ```tsx
 * <ResourcesContent categories={resourceCategories} />
 * ```
 *
 * @returns {JSX.Element} The rendered resources content
 */
export const ResourcesContent: React.FC<ResourcesContentProps> = ({ categories }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Resources
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Everything you need to get started with our platform
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="h-5 w-5 flex-none text-primary-600">{category.icon}</div>
                  {category.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">{category.description}</p>
                  <div className="mt-6">
                    {category.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700">
                          <div className="h-6 w-6 text-gray-600 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-500">
                            {resource.icon}
                          </div>
                        </div>
                        <div>
                          <a
                            href={resource.link}
                            className="font-semibold text-gray-900 dark:text-white"
                          >
                            {resource.title}
                            <span className="absolute inset-0" />
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

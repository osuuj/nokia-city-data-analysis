'use client';

import { Icon } from '@iconify/react';

interface DashboardEmptyProps {
  /**
   * Title to display when no data is available
   * @default "No data available"
   */
  title?: string;
  /**
   * Message to display when no data is available
   * @default "There is no data to display at this time."
   */
  message?: string;
  /**
   * Icon to display when no data is available
   * @default "mdi:database-off"
   */
  icon?: string;
}

/**
 * DashboardEmpty component
 * Renders a message when no data is available in the dashboard
 */
export function DashboardEmpty({
  title = 'No data available',
  message = 'There is no data to display at this time.',
  icon = 'mdi:database-off',
}: DashboardEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-6xl text-gray-300 dark:text-gray-600">
        <Icon icon={icon} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}

import type { ResourceData } from '../types';

/**
 * Resource data for Nokia City Data Analysis platform
 */
export const resourcesData: ResourceData = {
  categories: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description:
        'Essential information to help you get started with the Nokia City Data Analysis platform',
      icon: 'lucide:rocket',
      resources: [
        {
          id: 'platform-overview',
          title: 'Platform Overview',
          description: 'Learn about the Nokia City Data Analysis platform and its key features.',
          icon: 'lucide:layers',
          type: 'Guide',
          category: 'getting-started',
          link: '/resources/platform-overview',
          tags: ['overview', 'beginner', 'introduction'],
          createdAt: '2024-05-15',
          updatedAt: '2024-05-15',
          isWorkInProgress: false,
        },
        {
          id: 'dashboard-guide',
          title: 'Dashboard Guide',
          description: 'A comprehensive guide to navigating and using the interactive dashboard.',
          icon: 'lucide:layout-dashboard',
          type: 'Guide',
          category: 'getting-started',
          link: '/resources/dashboard-guide',
          tags: ['dashboard', 'tutorial', 'beginner'],
          createdAt: '2024-05-15',
          updatedAt: '2024-05-15',
          isWorkInProgress: true,
        },
      ],
    },
    {
      id: 'data-insights',
      title: 'Data Insights',
      description: 'Learn how to analyze and interpret Finnish company data',
      icon: 'lucide:bar-chart-2',
      resources: [
        {
          id: 'map-visualization-guide',
          title: 'Map Visualization Guide',
          description:
            'How to use the interactive map to discover geographic patterns in company data.',
          icon: 'lucide:map',
          type: 'Guide',
          category: 'data-insights',
          link: '/resources/data-insights/map-visualization-guide',
          tags: ['visualization', 'map', 'geographic'],
          createdAt: '2024-05-15',
          updatedAt: '2024-05-15',
          isWorkInProgress: true,
        },
      ],
    },
  ],
};

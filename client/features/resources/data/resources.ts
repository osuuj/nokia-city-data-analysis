import type { ResourceData } from '../types';

/**
 * Sample resource data
 */
export const resourcesData: ResourceData = {
  categories: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Resources to help you get started with our platform',
      icon: 'lucide:rocket',
      resources: [
        {
          id: 'dashboard-guide',
          title: 'How to Use the Dashboard',
          description:
            'A comprehensive guide to navigating and using all features of our platform.',
          icon: 'lucide:book-open',
          type: 'Guide',
          category: 'getting-started',
          link: '/resources/dashboard-guide',
          tags: ['dashboard', 'tutorial', 'beginner'],
          createdAt: '2023-01-15',
          updatedAt: '2023-03-20',
        },
        {
          id: 'search-faq',
          title: 'Company Search & Map FAQ',
          description: 'Answers to frequently asked questions about our search and map features.',
          icon: 'lucide:help-circle',
          type: 'FAQ',
          category: 'getting-started',
          link: '/resources/search-faq',
          tags: ['search', 'map', 'faq'],
          createdAt: '2023-02-10',
          updatedAt: '2023-04-05',
        },
      ],
    },
    {
      id: 'guides',
      title: 'Guides & Tutorials',
      description: 'In-depth guides and tutorials for advanced users',
      icon: 'lucide:book',
      resources: [
        {
          id: 'data-visualization',
          title: 'Data Visualization Best Practices',
          description:
            'Learn how to create effective data visualizations for your business insights.',
          icon: 'lucide:bar-chart',
          type: 'Guide',
          category: 'guides',
          link: '/resources/data-visualization',
          tags: ['visualization', 'analytics', 'best-practices'],
          createdAt: '2023-03-05',
          updatedAt: '2023-05-12',
        },
        {
          id: 'export-data',
          title: 'Exporting and Analyzing Data',
          description: 'Step-by-step guide to exporting and analyzing your company data.',
          icon: 'lucide:download',
          type: 'Guide',
          category: 'guides',
          link: '/resources/export-data',
          tags: ['export', 'analysis', 'data'],
          createdAt: '2023-04-18',
          updatedAt: '2023-06-22',
        },
      ],
    },
    {
      id: 'templates',
      title: 'Templates & Downloads',
      description: 'Ready-to-use templates and downloadable resources',
      icon: 'lucide:file-text',
      resources: [
        {
          id: 'company-profile',
          title: 'Company Profile Template',
          description: 'A template for creating comprehensive company profiles.',
          icon: 'lucide:file',
          type: 'Template',
          category: 'templates',
          link: '/resources/templates/company-profile.pdf',
          tags: ['template', 'profile', 'download'],
          createdAt: '2023-05-20',
          updatedAt: '2023-07-15',
        },
        {
          id: 'industry-report',
          title: 'Industry Analysis Report',
          description: 'A template for creating industry analysis reports.',
          icon: 'lucide:file',
          type: 'Template',
          category: 'templates',
          link: '/resources/templates/industry-report.pdf',
          tags: ['template', 'report', 'analysis'],
          createdAt: '2023-06-10',
          updatedAt: '2023-08-05',
        },
      ],
    },
  ],
};

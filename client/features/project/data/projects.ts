import { type Project, ProjectCategory, ProjectStatus } from '../types';

/**
 * Project data for the Osuuj Data Analysis platform
 *
 * This file contains the production project data for display throughout the application.
 * The data follows the Project interface structure and includes all relevant project information.
 */
export const projectsData: Project[] = [
  {
    id: '1',
    title: 'Osuuj Data Analysis Platform',
    subtitle:
      'A comprehensive data pipeline and visualization system for analyzing Finnish company data.',
    description:
      'A full-stack platform combining ETL data processing with interactive visualization tools to provide insights into Finnish company distributions and market trends. Built with a Python ETL pipeline, FastAPI backend, and Next.js frontend with responsive visualization dashboards.',
    image: '/images/projects/osuuj-platform.webp',
    gallery: [
      {
        src: '/images/projects/osuuj-dashboard-table.webp',
        alt: 'Table view',
        caption: 'Interactive search interface with multiple filtering options',
      },
      {
        src: '/images/projects/osuuj-dashboard-map.webp',
        alt: 'Map view',
        caption: 'Detailed company information with geospatial visualization',
      },
      {
        src: '/images/projects/osuuj-dashboard-analytics.webp',
        alt: 'Analytics view',
        caption: 'Analytics of Finnish companies across different cities',
      },
    ],
    category: ProjectCategory.Web,
    tags: [
      'Python',
      'Pandas',
      'PostgreSQL',
      'ETL',
      'FastAPI',
      'REST API',
      'SQLAlchemy',
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Data visualization',
      'Mapbox',
      'Docker',
      'GitHub Actions',
    ],
    goals: [
      'Build an end-to-end data processing and visualization platform',
      'Extract, transform, and load Finnish company data into a structured database',
      'Create interactive dashboards with map, table, and analytics views',
      'Provide a user-friendly interface for exploring company data by location and industry',
      'Implement a responsive design for multiple device types',
    ],
    timeline: 'osuuj-platform',
    role: 'Full-Stack Development Team',
    team: ['Juuso Juvonen', 'Kasperi Rautio'],
    demoUrl: '/dashboard',
    repoUrl: 'https://github.com/osuuj/nokia-city-data-analysis',
    featured: true,
    status: ProjectStatus.Completed,
  },
  {
    id: '2',
    title: 'AI Business Assistant',
    subtitle: 'Intelligent assistant for company data insights',
    description:
      'An AI-powered assistant that helps users navigate company data, generate insights, and answer business intelligence questions based on the processed data in the platform.',
    image: 'https://img.heroui.chat/image/ai?w=800&h=500&u=1',
    category: ProjectCategory.AI,
    tags: ['AI', 'NLP', 'Python', 'Machine Learning', 'LLM', 'Data Insights'],
    demoUrl: '/coming-soon',
    status: ProjectStatus.Planning,
    timeline: 'Q3 2025',
  },
  {
    id: '3',
    title: 'Data Pipeline Extensions',
    subtitle: 'Enhanced ETL processes for additional data sources',
    description:
      'Planned extensions to the ETL pipeline to incorporate additional Finnish business data sources and provide more comprehensive analytics capabilities.',
    image: 'https://img.heroui.chat/image/ai?w=800&h=500&u=4',
    category: ProjectCategory.AI,
    tags: ['Python', 'ETL', 'Pandas', 'PostgreSQL', 'Data Engineering'],
    demoUrl: '/coming-soon',
    status: ProjectStatus.Planning,
    timeline: 'Q4 2025',
  },
];

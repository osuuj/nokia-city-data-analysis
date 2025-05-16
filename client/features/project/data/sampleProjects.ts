import { type Project, ProjectCategory, ProjectStatus } from '../types';

/**
 * Sample project data for development and testing
 *
 * This file contains mock project data that is used during development
 * and testing phases. The data follows the Project interface structure
 * and includes examples of all possible project properties.
 *
 * @remarks
 * - Each project has a unique ID and required fields (title, description)
 * - Optional fields demonstrate different use cases and data structures
 * - Images use local files from the public directory
 * - Tags and categories follow the defined enums
 *
 * @example
 * ```ts
 * // Access a specific project
 * const project = projectsData.find(p => p.id === '1');
 *
 * // Filter projects by category
 * const webProjects = projectsData.filter(p => p.category === ProjectCategory.Web);
 * ```
 */
export const projectsData: Project[] = [
  {
    id: '1',
    title: 'Osuuj Company Search Platform',
    subtitle: 'A fast, scalable way to search and analyze companies by location and industry.',
    description:
      'A comprehensive company discovery platform designed for analysts, researchers, and job seekers to explore and analyze organizations across regions. Using open-source data processed through an ETL pipeline, the platform maps Finnish companies geographically and delivers actionable industry insights through intuitive analytics.',
    image: '/images/projects/osuuj-platform.webp',
    gallery: [
      {
        src: '/images/projects/osuuj-search.webp',
        alt: 'Company search interface',
        caption: 'Main search interface with filters',
      },
      {
        src: '/images/projects/osuuj-details.webp',
        alt: 'Company details view',
        caption: 'Detailed company information page',
      },
    ],
    category: ProjectCategory.Web,
    tags: [
      'Python',
      'Pandas',
      'Postgres',
      'ETL',
      'FastAPI',
      'REST API',
      'SQLAlchemy',
      'React',
      'Next.js',
      'TypeScript',
      'HeroUI',
      'Tailwind CSS',
      'Data Visualization',
      'AWS',
    ],
    goals: [
      'Design and build a full-stack application from scratch to showcase development skills',
      'Create an interactive analytics view with map-based company visualization',
      'Ensure a smooth and intuitive user experience for researchers, analysts, and job seekers',
      'Integrate and process open data sources through a custom ETL pipeline',
      'Deliver meaningful insights through visual dashboards and clean UI design',
    ],
    timeline: 'Q4 2024 – Q2 2025',
    role: 'Lead Developer',
    team: ['Juuso Juvonen', 'Kasper Rautio'],
    demoUrl: '/dashboard',
    repoUrl: 'https://github.com/osuuj/nokia-city-data-analysis',
    featured: true,
    status: ProjectStatus.Active,
  },
  {
    id: '2',
    title: 'Osuuj AI Chat',
    description: 'In Progress ...',
    image: '/images/projects/ai-chat.webp',
    category: ProjectCategory.AI,
    tags: ['Next.js', 'TypeScript'],
    demoUrl: '/dashboard',
    status: ProjectStatus.Planning,
  },
];

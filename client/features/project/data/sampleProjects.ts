import { type Project, ProjectCategory, ProjectStatus } from '../types';

/**
 * Sample project data for development and testing
 */
export const projectsData: Project[] = [
  {
    id: '1',
    title: 'Osuuj Company Search Platform',
    subtitle: 'A fast, scalable way to search and analyze companies by location and industry.',
    description:
      'A comprehensive company discovery platform designed for analysts, researchers, and job seekers to explore and analyze organizations across regions. Using open-source data processed through an ETL pipeline, the platform maps Finnish companies geographically and delivers actionable industry insights through intuitive analytics.',
    image: 'https://img.heroui.chat/image/ai?w=800&h=500&u=1',
    gallery: [
      {
        src: 'https://img.heroui.chat/image/ai?w=800&h=500&u=3',
        alt: 'Company search interface',
        caption: 'Main search interface with filters',
      },
      {
        src: 'https://img.heroui.chat/image/ai?w=800&h=500&u=4',
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
    image: 'https://img.heroui.chat/image/ai?w=800&h=500&u=2',
    category: ProjectCategory.AI,
    tags: ['Next.js', 'TypeScript'],
    demoUrl: '/dashboard',
    status: ProjectStatus.Planning,
  },
];

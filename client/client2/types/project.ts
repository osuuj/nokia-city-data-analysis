export interface Project {
  id: string;
  title: string;
  subtitle?: string; // ← Short context line
  description: string;
  image: string;
  gallery?: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  category: string;
  tags: string[];
  goals?: string[]; // ← Bullet points
  timeline?: string; // ← e.g. "Q1 2025 – Q3 2025"
  role?: string; // ← e.g. "Full-stack Developer"
  team?: string[]; // ← List of team members
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  status?: 'active' | 'planning';
}

export interface ProjectCardProps {
  project: Project;
}

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
    category: 'web',
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
    demoUrl: '/home',
    repoUrl: 'https://github.com/osuuj/nokia-city-data-analysis',
    featured: true,
    status: 'active',
  },
  {
    id: '2',
    title: 'Osuuj AI Chat',
    description: 'In Progress ...',
    image: 'https://img.heroui.chat/image/ai?w=800&h=500&u=2',
    category: 'ai',
    tags: ['Next.js', 'TypeScript'],
    status: 'planning',
  },
];

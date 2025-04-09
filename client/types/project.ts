export interface Project {
  id: string;
  title: string;
  subtitle?: string; // ← Short context line
  description: string;
  image: string;
  gallery?: string[]; // ← Multiple images/screenshots
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
      'A comprehensive company search platform for discovering and analyzing organizations across regions. Built for analysts and researchers to get actionable insights from data.',
    image: 'https://img.heroui.chat/image/ai?w=800&h=500&u=1',
    gallery: [
      'https://img.heroui.chat/image/ai?w=800&h=500&u=3',
      'https://img.heroui.chat/image/ai?w=800&h=500&u=4',
    ],
    category: 'web',
    tags: ['Python', 'Postgres', 'FastAPI', 'React', 'Next.js', 'TypeScript'],
    goals: [
      'Enable efficient company search across European markets',
      'Visualize company clusters on maps',
      'Integrate with open data and APIs',
    ],
    timeline: 'Q2 2024 – Q4 2024',
    role: 'Lead Developer',
    team: ['John Doe', 'Mila Smith'],
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

import type { TeamMember } from '../types/profileTypes';

export const teamMembers: TeamMember[] = [
  {
    id: 'juuso',
    name: 'Juuso',
    jobTitle: 'Lead Developer',
    bio: 'Specializes in creating intuitive, beautiful user interfaces with modern web technologies.',
    shortBio: 'Full-stack developer with a passion for UI/UX design.',
    portfolioLink: '/about/juuso',
    avatarSrc: '/images/team/juuso-juvonen.svg',
    skills: [
      'Data Engineering',
      'ETL',
      'AWS',
      'Python',
      'React',
      'TypeScript',
      'Next.js',
      'UI/UX Design',
      'Figma',
    ],
    socialLinks: {
      github: 'https://github.com/osuuj',
      linkedin: 'https://linkedin.com/in/jutoju',
    },
    projects: ['1', '2'],
    achievements: [
      {
        title: 'Lead Developer',
        description: 'Led the development of the Osuuj Search Platform',
        date: '2024',
      },
    ],
  },
  {
    id: 'kasperi',
    name: 'Kasperi',
    jobTitle: 'Developer',
    bio: 'Expert in building efficient and user-friendly web applications.',
    shortBio: 'Full-stack developer with a focus on frontend, especially React.',
    portfolioLink: '/about/kasperi',
    avatarSrc: '/images/team/kasperi-rautio.svg',
    skills: [
      'Python',
      'FastAPI',
      'TypeScript',
      'React',
      'Next.js',
      'PostgreSQL',
      'Docker',
      'AWS',
      'Data Engineering',
      'ETL',
    ],
    socialLinks: {
      github: 'https://github.com/kasperi-r',
      linkedin: 'https://linkedin.com/in/kasperi-rautio',
    },
    projects: ['1'],
    achievements: [
      {
        title: 'Backend Developer',
        description: 'Designed and implemented the ETL pipeline for company data processing',
        date: '2024',
      },
    ],
  },
];

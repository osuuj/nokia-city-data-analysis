import type { TeamMember } from '../types/profileTypes';

export const teamMembers: TeamMember[] = [
  {
    id: 'juuso',
    name: 'Juuso',
    jobTitle: 'Lead Developer',
    bio: 'Specializes in creating intuitive, beautiful user interfaces with modern web technologies.',
    shortBio: 'Full-stack developer with a passion for UI/UX design.',
    portfolioLink: '/about/juuso',
    avatarSrc: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=juuso',
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
    bio: 'Expert in building robust server architectures and efficient database solutions.',
    shortBio: 'Backend developer focused on scalable architectures.',
    portfolioLink: '/about/kasperi',
    avatarSrc: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=kasperi',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'Data Engineering', 'ETL'],
    socialLinks: {
      github: 'https://github.com/kasperi',
      linkedin: 'https://linkedin.com/in/kasperi',
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

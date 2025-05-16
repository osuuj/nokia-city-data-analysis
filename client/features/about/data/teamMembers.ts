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
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'UI/UX Design', 'AWS'],
    socialLinks: {
      github: 'https://github.com/osuuj',
      linkedin: 'https://linkedin.com/in/juuso',
    },
    projects: ['1', '2'],
    achievements: [
      {
        title: 'Lead Developer',
        description: 'Led the development of the Osuuj Company Search Platform',
        date: '2024',
      },
    ],
  },
  {
    id: 'kassu',
    name: 'Kassu',
    jobTitle: 'Developer',
    bio: 'Expert in building robust server architectures and efficient database solutions.',
    shortBio: 'Backend developer focused on scalable architectures.',
    portfolioLink: '/about/kassu',
    avatarSrc: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=kassu',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'Data Engineering', 'ETL'],
    socialLinks: {
      github: 'https://github.com/kassu',
      linkedin: 'https://linkedin.com/in/kassu',
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

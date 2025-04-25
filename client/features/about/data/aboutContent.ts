import type { TeamMember } from '@/features/team/types';

export const aboutStory = {
  title: 'Our Story',
  paragraphs: [
    'We started this project to help people discover local companies with powerful tools like interactive search and maps. Our mission is to connect communities with local businesses and provide resources that help both sides thrive.',
    "What began as a simple idea has grown into a comprehensive platform that serves thousands of users. We're constantly expanding our features and improving the experience based on community feedback.",
    'Our team is passionate about supporting local economies and building technology that makes a real difference in how people discover and connect with businesses in their communities.',
  ],
};

export const teamSection = {
  title: 'Meet the Team',
  description:
    'Our talented team is dedicated to building innovative solutions for local businesses.',
};

// Extended profile information for team members
export interface TeamMemberProfile {
  member: TeamMember;
  skills: {
    name: string;
    level: number;
  }[];
  projects: {
    title: string;
    description: string;
    tech: string[];
    link: string;
  }[];
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience?: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
}

export const teamMemberProfiles: Record<string, TeamMemberProfile> = {
  juuso: {
    member: {
      id: 'juuso',
      name: 'Juuso',
      jobTitle: 'Lead Developer',
      bio: 'Specializes in creating intuitive, beautiful user interfaces with modern web technologies. Passionate about building scalable and maintainable applications that provide great user experiences.',
      shortBio: 'Full-stack developer with a passion for UI/UX design.',
      portfolioLink: '/about/juuso',
      avatarSrc: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=juuso',
      skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'UI/UX Design', 'AWS'],
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
    skills: [
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Next.js', level: 92 },
      { name: 'Node.js', level: 85 },
      { name: 'UI/UX Design', level: 88 },
      { name: 'AWS', level: 80 },
    ],
    projects: [
      {
        title: 'Company Search Platform',
        description: 'Interactive search platform for discovering local businesses',
        tech: ['React', 'Next.js', 'TypeScript', 'Node.js'],
        link: '/projects/company-search',
      },
      {
        title: 'Data Visualization Dashboard',
        description: 'Real-time data visualization for business analytics',
        tech: ['React', 'D3.js', 'TypeScript', 'Firebase'],
        link: '/projects/data-dashboard',
      },
      {
        title: 'Mobile App Development',
        description: 'Cross-platform mobile app for business discovery',
        tech: ['React Native', 'TypeScript', 'Firebase'],
        link: '/projects/mobile-app',
      },
    ],
    education: [
      {
        degree: 'Master of Science in Computer Science',
        institution: 'University of Technology',
        year: '2020',
      },
      {
        degree: 'Bachelor of Science in Software Engineering',
        institution: 'Tech Institute',
        year: '2018',
      },
    ],
    experience: [
      {
        title: 'Lead Developer',
        company: 'Osuuj',
        period: '2022 - Present',
        description:
          'Leading the development of the Osuuj Company Search Platform and managing the development team.',
      },
      {
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        period: '2020 - 2022',
        description:
          'Developed and maintained multiple web applications using React and TypeScript.',
      },
    ],
  },
  kassu: {
    member: {
      id: 'kassu',
      name: 'Kassu',
      jobTitle: 'Developer',
      bio: 'Expert in building robust server architectures and efficient database solutions. Focuses on creating scalable backend systems that power modern web applications.',
      shortBio: 'Backend developer specializing in database optimization and API design.',
      portfolioLink: '/about/kassu',
      avatarSrc: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=kassu',
      skills: ['Python', 'SQL', 'Django', 'PostgreSQL', 'Docker', 'API Design', 'Data Engineering'],
      socialLinks: {
        github: 'https://github.com/kassu',
        linkedin: 'https://linkedin.com/in/kassu',
      },
      projects: ['1', '2'],
      achievements: [
        {
          title: 'Backend Developer',
          description:
            'Developed the data processing pipeline for the Osuuj Company Search Platform',
          date: '2024',
        },
      ],
    },
    skills: [
      { name: 'Node.js', level: 92 },
      { name: 'Python', level: 88 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'AWS', level: 80 },
      { name: 'Docker', level: 82 },
    ],
    projects: [
      {
        title: 'API Gateway Service',
        description: 'Scalable API gateway with rate limiting and authentication',
        tech: ['Node.js', 'Redis', 'Docker'],
        link: '/projects/api-gateway',
      },
      {
        title: 'Data Pipeline System',
        description: 'ETL pipeline for processing large datasets',
        tech: ['Python', 'Apache Airflow', 'PostgreSQL'],
        link: '/projects/data-pipeline',
      },
      {
        title: 'Cloud Infrastructure',
        description: 'Automated cloud infrastructure deployment',
        tech: ['AWS', 'Terraform', 'Docker'],
        link: '/projects/cloud-infra',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Technology',
        year: '2019',
      },
    ],
    experience: [
      {
        title: 'Backend Developer',
        company: 'Osuuj',
        period: '2021 - Present',
        description:
          'Developing and maintaining the backend infrastructure for the Osuuj Company Search Platform.',
      },
      {
        title: 'Software Engineer',
        company: 'Data Systems Ltd.',
        period: '2019 - 2021',
        description: 'Built and optimized database systems and APIs for enterprise clients.',
      },
    ],
  },
};

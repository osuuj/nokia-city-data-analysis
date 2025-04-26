import type { Education, Experience, Project, TeamMember } from '../types';

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
    category?: 'frontend' | 'backend' | 'devops' | 'design' | 'other';
  }[];
  projects: Project[];
  education?: Education[];
  experience?: Experience[];
}

export const teamMemberProfiles: Record<string, TeamMemberProfile> = {
  juuso: {
    member: {
      id: 'juuso',
      name: 'Juuso',
      role: 'Lead Developer',
      bio: 'Specializes in creating intuitive, beautiful user interfaces with modern web technologies. Passionate about building scalable and maintainable applications that provide great user experiences.',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=juuso',
      email: 'juuso@example.com',
      social: {
        github: 'https://github.com/osuuj',
        linkedin: 'https://linkedin.com/in/juuso',
      },
      skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'UI/UX Design', 'AWS'],
      projects: ['1', '2'],
      experience: [
        {
          company: 'Osuuj',
          position: 'Lead Developer',
          startDate: '2022',
          description: 'Led the development of the Osuuj Company Search Platform',
        },
      ],
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2016',
          endDate: '2020',
          description: 'Graduated with honors',
        },
      ],
    },
    skills: [
      { name: 'React', level: 95, category: 'frontend' },
      { name: 'TypeScript', level: 90, category: 'frontend' },
      { name: 'Next.js', level: 92, category: 'frontend' },
      { name: 'Node.js', level: 85, category: 'backend' },
      { name: 'UI/UX Design', level: 88, category: 'design' },
      { name: 'AWS', level: 80, category: 'devops' },
    ],
    projects: [
      {
        id: '1',
        title: 'Company Search Platform',
        description: 'Interactive search platform for discovering local businesses',
        technologies: ['React', 'Next.js', 'TypeScript', 'Node.js'],
        image: '/images/projects/company-search.jpg',
        url: '/projects/company-search',
        github: 'https://github.com/osuuj/company-search',
        startDate: '2023-01',
        endDate: '2024-01',
      },
      {
        id: '2',
        title: 'Data Visualization Dashboard',
        description: 'Real-time data visualization for business analytics',
        technologies: ['React', 'D3.js', 'TypeScript', 'Firebase'],
        image: '/images/projects/data-dashboard.jpg',
        url: '/projects/data-dashboard',
        github: 'https://github.com/osuuj/data-dashboard',
        startDate: '2022-06',
        endDate: '2022-12',
      },
    ],
    experience: [
      {
        id: '1',
        title: 'Lead Developer',
        company: 'Osuuj',
        period: '2022 - Present',
        description: 'Leading the development of the Osuuj Company Search Platform.',
        technologies: ['React', 'TypeScript', 'Next.js', 'Node.js'],
        achievements: [
          'Led a team of 5 developers',
          'Improved application performance by 40%',
          'Implemented CI/CD pipeline',
        ],
      },
    ],
    education: [
      {
        id: '1',
        institution: 'University of Technology',
        degree: 'Bachelor of Science in Computer Science',
        field: 'Computer Science',
        startDate: '2016',
        endDate: '2020',
        description:
          'Graduated with honors, specializing in web technologies and user interface design.',
        gpa: 3.8,
      },
    ],
  },
  kassu: {
    member: {
      id: 'kassu',
      name: 'Kassu',
      role: 'Developer',
      bio: 'Expert in building robust server architectures and efficient database solutions. Focuses on creating scalable backend systems that power modern web applications.',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=kassu',
      email: 'kassu@example.com',
      social: {
        github: 'https://github.com/kassu',
        linkedin: 'https://linkedin.com/in/kassu',
      },
      skills: ['Python', 'SQL', 'Django', 'PostgreSQL', 'Docker', 'API Design', 'Data Engineering'],
      projects: ['3', '4'],
      experience: [
        {
          company: 'Osuuj',
          position: 'Backend Developer',
          startDate: '2021',
          description:
            'Developing and maintaining the backend infrastructure for the Osuuj Company Search Platform.',
        },
      ],
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2016',
          endDate: '2020',
          description: 'Focus on backend development and database systems',
        },
      ],
    },
    skills: [
      { name: 'Node.js', level: 92, category: 'backend' },
      { name: 'Python', level: 88, category: 'backend' },
      { name: 'PostgreSQL', level: 85, category: 'backend' },
      { name: 'AWS', level: 80, category: 'devops' },
      { name: 'Docker', level: 82, category: 'devops' },
    ],
    projects: [
      {
        id: '3',
        title: 'API Gateway Service',
        description: 'Scalable API gateway with rate limiting and authentication',
        technologies: ['Node.js', 'Redis', 'Docker'],
        image: '/images/projects/api-gateway.jpg',
        url: '/projects/api-gateway',
        github: 'https://github.com/kassu/api-gateway',
        startDate: '2023-03',
        endDate: '2023-09',
      },
      {
        id: '4',
        title: 'Data Pipeline System',
        description: 'ETL pipeline for processing large datasets',
        technologies: ['Python', 'Apache Airflow', 'PostgreSQL'],
        image: '/images/projects/data-pipeline.jpg',
        url: '/projects/data-pipeline',
        github: 'https://github.com/kassu/data-pipeline',
        startDate: '2022-09',
        endDate: '2023-02',
      },
    ],
    experience: [
      {
        id: '2',
        title: 'Backend Developer',
        company: 'Osuuj',
        period: '2021 - Present',
        description:
          'Developing and maintaining the backend infrastructure for the Osuuj Company Search Platform.',
        technologies: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
        achievements: [
          'Implemented microservices architecture',
          'Reduced API response time by 60%',
          'Set up automated deployment pipeline',
        ],
      },
      {
        id: '3',
        title: 'Software Engineer',
        company: 'Data Systems Ltd.',
        period: '2019 - 2021',
        description: 'Built and optimized database systems and APIs for enterprise clients.',
        technologies: ['Python', 'PostgreSQL', 'Redis'],
        achievements: [
          'Optimized database queries resulting in 40% faster response times',
          'Implemented caching layer reducing server load by 50%',
        ],
      },
    ],
    education: [
      {
        id: '2',
        institution: 'University of Technology',
        degree: 'Bachelor of Science in Computer Science',
        field: 'Computer Science',
        startDate: '2016',
        endDate: '2020',
        description: 'Focus on backend development and database systems',
        gpa: 3.7,
      },
    ],
  },
};

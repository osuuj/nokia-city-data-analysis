import type { TeamMemberProfile } from '../schemas';

export const teamMemberProfiles: TeamMemberProfile[] = [
  {
    member: {
      id: '1',
      name: 'John Doe',
      role: 'Senior Full Stack Developer',
      bio: 'Passionate about building scalable web applications and mentoring junior developers.',
      avatar: '/images/avatars/john-doe.jpg',
      email: 'john.doe@example.com',
      social: {
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: 'https://twitter.com/johndoe',
      },
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
      projects: ['p1', 'p2'],
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Full Stack Developer',
          startDate: '2020-01',
          description: 'Leading development of enterprise web applications.',
        },
        {
          company: 'Startup Inc',
          position: 'Full Stack Developer',
          startDate: '2018-03',
          endDate: '2019-12',
          description: 'Developed and maintained multiple client projects.',
        },
      ],
      education: [
        {
          institution: 'Tech University',
          degree: 'Master of Science',
          field: 'Computer Science',
          startDate: '2016-09',
          endDate: '2018-05',
          description: 'Focus on Software Engineering and Distributed Systems',
        },
        {
          institution: 'State University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2012-09',
          endDate: '2016-05',
          description: 'Focus on Software Development',
        },
      ],
    },
    skills: [
      { name: 'React', level: 90, category: 'frontend' },
      { name: 'TypeScript', level: 85, category: 'frontend' },
      { name: 'Node.js', level: 80, category: 'backend' },
      { name: 'PostgreSQL', level: 75, category: 'backend' },
      { name: 'AWS', level: 70, category: 'devops' },
    ],
    projects: [
      {
        id: 'p1',
        title: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
        image: '/images/projects/ecommerce.jpg',
        url: 'https://ecommerce.example.com',
        github: 'https://github.com/johndoe/ecommerce',
        startDate: '2023-01',
        endDate: '2023-12',
      },
      {
        id: 'p2',
        title: 'Task Management App',
        description: 'Developed a real-time task management application using React and Firebase.',
        technologies: ['React', 'Firebase', 'Material-UI'],
        image: '/images/projects/task-manager.jpg',
        url: 'https://tasks.example.com',
        github: 'https://github.com/johndoe/task-manager',
        startDate: '2022-06',
        endDate: '2022-12',
      },
    ],
    experience: [
      {
        id: 'e1',
        title: 'Senior Full Stack Developer',
        company: 'Tech Corp',
        period: '2020-01 - Present',
        description: 'Leading development of enterprise web applications.',
        technologies: ['React', 'Node.js', 'TypeScript', 'AWS'],
        achievements: [
          'Reduced application load time by 40%',
          'Mentored 5 junior developers',
          'Implemented CI/CD pipeline',
        ],
      },
      {
        id: 'e2',
        title: 'Full Stack Developer',
        company: 'Startup Inc',
        period: '2018-03 - 2019-12',
        description: 'Developed and maintained multiple client projects.',
        technologies: ['React', 'Express', 'MongoDB'],
        achievements: ['Launched 3 major client projects', 'Implemented automated testing suite'],
      },
    ],
    education: [
      {
        id: 'ed1',
        institution: 'Tech University',
        degree: 'Master of Science',
        field: 'Computer Science',
        startDate: '2016-09',
        endDate: '2018-05',
        description: 'Focus on Software Engineering and Distributed Systems',
        gpa: 3.9,
      },
      {
        id: 'ed2',
        institution: 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2012-09',
        endDate: '2016-05',
        description: 'Focus on Software Development',
        gpa: 3.8,
      },
    ],
  },
  // Add more team member profiles as needed
];

export const mockProfilesResponse = {
  success: true,
  data: teamMemberProfiles,
};

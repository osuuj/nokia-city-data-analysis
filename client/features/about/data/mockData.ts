import type { TeamMemberProfile } from '../schemas';

export const teamMemberProfiles: TeamMemberProfile[] = [
  {
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
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
        url: 'https://ecommerce.example.com',
        githubUrl: 'https://github.com/johndoe/ecommerce',
        image: '/images/projects/ecommerce.jpg',
      },
      {
        id: 'p2',
        name: 'Task Management App',
        description: 'Developed a real-time task management application using React and Firebase.',
        technologies: ['React', 'Firebase', 'Material-UI'],
        url: 'https://tasks.example.com',
        githubUrl: 'https://github.com/johndoe/task-manager',
      },
    ],
    experience: [
      {
        id: 'e1',
        company: 'Tech Corp',
        position: 'Senior Full Stack Developer',
        startDate: '2020-01',
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
        company: 'Startup Inc',
        position: 'Full Stack Developer',
        startDate: '2018-03',
        endDate: '2019-12',
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
        achievements: ['Published research paper on distributed systems', 'Graduated with honors'],
      },
      {
        id: 'ed2',
        institution: 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2012-09',
        endDate: '2016-05',
        description: 'Focus on Software Development',
        achievements: ["Dean's List all semesters", 'Led programming club'],
      },
    ],
  },
  // Add more team member profiles as needed
];

export const mockProfilesResponse = {
  success: true,
  data: teamMemberProfiles,
};

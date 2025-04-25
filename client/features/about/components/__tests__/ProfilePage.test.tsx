import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { useProfileData } from '../../hooks/useProfileData';
import ProfilePage from '../ProfilePage';

// Mock the useProfileData hook
jest.mock('../../hooks/useProfileData');
const mockUseProfileData = useProfileData as jest.MockedFunction<typeof useProfileData>;

// Mock the profile data
const mockProfile = {
  member: {
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
  skills: [
    { name: 'React', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Next.js', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'Python', level: 75 },
  ],
  projects: [
    {
      title: 'Company Search Platform',
      description: 'A platform for searching and discovering companies.',
      tech: ['React', 'TypeScript', 'Next.js', 'Node.js'],
      link: 'https://example.com/project1',
    },
    {
      title: 'Data Visualization Dashboard',
      description: 'A dashboard for visualizing data.',
      tech: ['React', 'D3.js', 'TypeScript'],
      link: 'https://example.com/project2',
    },
  ],
  experience: [
    {
      title: 'Lead Developer',
      company: 'Osuuj',
      period: '2022 - Present',
      description: 'Leading the development of the Osuuj Company Search Platform.',
    },
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology',
      year: '2020',
    },
  ],
};

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton when data is loading', () => {
    (useProfileData as jest.Mock).mockReturnValue({
      profile: null,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useProfileData>);

    render(<ProfilePage id="juuso" />);

    // Check if the skeleton is rendered
    expect(screen.getByTestId('profile-skeleton')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    (useProfileData as jest.Mock).mockReturnValue({
      profile: null,
      isLoading: false,
      error: new Error('Failed to load profile'),
    } as ReturnType<typeof useProfileData>);

    render(<ProfilePage id="juuso" />);

    // Check if the error message is rendered
    expect(screen.getByText('Error Loading Profile')).toBeInTheDocument();
    expect(
      screen.getByText('Failed to load profile data. Please try again later.'),
    ).toBeInTheDocument();
  });

  it('renders profile data when loaded successfully', async () => {
    (useProfileData as jest.Mock).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProfileData>);

    render(<ProfilePage id="juuso" />);

    // Wait for the profile data to be rendered
    await waitFor(() => {
      expect(screen.getByText('Juuso')).toBeInTheDocument();
      expect(screen.getByText('Lead Developer')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Specializes in creating intuitive, beautiful user interfaces with modern web technologies.',
        ),
      ).toBeInTheDocument();
    });

    // Check if the skills section is rendered
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Check if the projects section is rendered
    expect(screen.getByText('Company Search Platform')).toBeInTheDocument();
    expect(screen.getByText('Data Visualization Dashboard')).toBeInTheDocument();

    // Check if the experience section is rendered
    expect(screen.getByText('Lead Developer')).toBeInTheDocument();
    expect(screen.getByText('Osuuj')).toBeInTheDocument();

    // Check if the education section is rendered
    expect(screen.getByText('Bachelor of Science in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('University of Technology')).toBeInTheDocument();
  });
});

import type { QueryObserverResult } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { useProfileData } from '../../hooks/useProfileData';
import type { TeamMemberProfile } from '../../schemas';
import { ProfilePage } from '../ProfilePage';

// Mock the useProfileData hook
jest.mock('../../hooks/useProfileData');
const mockUseProfileData = useProfileData as jest.MockedFunction<typeof useProfileData>;

// Mock the profile data
const mockProfile: TeamMemberProfile = {
  member: {
    id: 'juuso',
    name: 'Juuso',
    role: 'Lead Developer',
    bio: 'Specializes in creating intuitive, beautiful user interfaces with modern web technologies.',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=juuso',
    email: 'juuso@example.com',
    social: {
      github: 'https://github.com/osuuj',
      linkedin: 'https://linkedin.com/in/juuso',
    },
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'UI/UX Design'],
    projects: ['1', '2'],
    experience: [
      {
        company: 'Osuuj',
        position: 'Lead Developer',
        startDate: '2022-01-01',
        description: 'Leading the development of the Osuuj Company Search Platform.',
      },
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016-09-01',
        endDate: '2020-06-30',
        description: 'Focus on software engineering and web development',
      },
    ],
  },
  skills: [
    { name: 'React', level: 95, category: 'frontend' },
    { name: 'TypeScript', level: 90, category: 'frontend' },
    { name: 'Next.js', level: 85, category: 'frontend' },
    { name: 'Node.js', level: 80, category: 'backend' },
    { name: 'Python', level: 75, category: 'backend' },
  ],
  projects: [
    {
      id: '1',
      title: 'Company Search Platform',
      description: 'A platform for searching and discovering companies.',
      technologies: ['React', 'TypeScript', 'Next.js', 'Node.js'],
      image: '/images/project1.jpg',
      url: 'https://example.com/project1',
      github: 'https://github.com/example/project1',
      startDate: '2023-01',
      endDate: '2024-01',
    },
    {
      id: '2',
      title: 'Data Visualization Dashboard',
      description: 'A dashboard for visualizing data.',
      technologies: ['React', 'D3.js', 'TypeScript'],
      image: '/images/project2.jpg',
      url: 'https://example.com/project2',
      github: 'https://github.com/example/project2',
      startDate: '2022-06',
      endDate: '2022-12',
    },
  ],
  experience: [
    {
      id: '1',
      title: 'Lead Developer',
      company: 'Osuuj',
      period: '2022-01 - Present',
      description: 'Leading the development of the Osuuj Company Search Platform.',
      technologies: ['React', 'TypeScript', 'Next.js', 'Node.js'],
      achievements: ['Led team of 5 developers', 'Improved performance by 50%'],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2016-09-01',
      endDate: '2020-06-30',
      description: 'Focus on software engineering and web development',
      gpa: 3.8,
    },
  ],
};

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton when data is loading', () => {
    const loadingResult: QueryObserverResult<TeamMemberProfile> = {
      data: undefined,
      isLoading: true,
      isError: false,
      isSuccess: false,
      status: 'pending',
      fetchStatus: 'fetching',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isPlaceholderData: false,
      isPaused: false,
      isRefetchError: false,
      isRefetching: false,
      isStale: false,
      refetch: jest.fn(),
      error: null,
      isPending: true,
      isLoadingError: false,
      isFetching: true,
      isInitialLoading: true,
      promise: Promise.resolve(mockProfile),
    };

    mockUseProfileData.mockReturnValue(loadingResult);

    render(<ProfilePage id="juuso" />);

    // Check if the skeleton is rendered
    expect(screen.getByTestId('profile-skeleton')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    const errorResult: QueryObserverResult<TeamMemberProfile> = {
      data: undefined,
      isLoading: false,
      isError: true,
      isSuccess: false,
      status: 'error',
      fetchStatus: 'idle',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 1,
      failureReason: new Error('Failed to load profile'),
      errorUpdateCount: 1,
      isFetched: true,
      isFetchedAfterMount: true,
      isPlaceholderData: false,
      isPaused: false,
      isRefetchError: false,
      isRefetching: false,
      isStale: false,
      refetch: jest.fn(),
      error: new Error('Failed to load profile'),
      isPending: false,
      isLoadingError: true,
      isFetching: false,
      isInitialLoading: false,
      promise: Promise.resolve(mockProfile),
    };

    mockUseProfileData.mockReturnValue(errorResult);

    render(<ProfilePage id="juuso" />);

    // Check if the error message is rendered
    expect(screen.getByText('Error Loading Profile')).toBeInTheDocument();
    expect(
      screen.getByText('Failed to load profile data. Please try again later.'),
    ).toBeInTheDocument();
  });

  it('renders profile data when loaded successfully', async () => {
    const successResult: QueryObserverResult<TeamMemberProfile> = {
      data: mockProfile,
      isLoading: false,
      isError: false,
      isSuccess: true,
      status: 'success',
      fetchStatus: 'idle',
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isPlaceholderData: false,
      isPaused: false,
      isRefetchError: false,
      isRefetching: false,
      isStale: false,
      refetch: jest.fn(),
      error: null,
      isPending: false,
      isLoadingError: false,
      isFetching: false,
      isInitialLoading: false,
      promise: Promise.resolve(mockProfile),
    };

    mockUseProfileData.mockReturnValue(successResult);

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
    expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
    expect(screen.getByText('University of Technology')).toBeInTheDocument();
  });
});

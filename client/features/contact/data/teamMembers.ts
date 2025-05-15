/**
 * Team members data for the Contact page
 */
import type { TeamMember } from '../types';

/**
 * List of team members with their contact information
 */
export const teamMembers: TeamMember[] = [
  {
    name: 'Juuso Juvonen',
    role: 'Lead Developer',
    email: 'superjuuso@gmail.com',
    socialLinks: [
      {
        icon: 'logos:linkedin-icon',
        href: 'https://linkedin.com/in/jutoju',
        label: 'linkedin.com/in/jutoju',
      },
      {
        icon: 'logos:github-icon',
        href: 'https://github.com/osuuj',
        label: 'github.com/osuuj',
      },
    ],
  },
  {
    name: 'Kasperi Rautio',
    role: 'Developer',
    email: 'kasperi.rautio@gmail.com',
    socialLinks: [
      {
        icon: 'logos:linkedin-icon',
        href: 'https://linkedin.com/in/kasperi-rautio',
        label: 'linkedin.com/in/kasperi-rautio',
      },
      {
        icon: 'logos:github-icon',
        href: 'https://github.com/kasperi-r',
        label: 'github.com/kasperi-r',
      },
    ],
  },
];

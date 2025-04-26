import type { ViewMode } from '@/features/dashboard/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { ViewModeToggle } from './ViewModeToggle';

// Mock the ThemeSwitch component
jest.mock('@/shared/components/ui/theme', () => ({
  ThemeSwitch: () => <div data-testid="theme-switch">Theme Switch</div>,
}));

// Mock the Icon component
jest.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`}>{icon}</span>,
}));

describe('ViewModeToggle', () => {
  const mockProps = {
    viewMode: 'table' as ViewMode,
    setViewMode: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all view mode options', () => {
    render(<ViewModeToggle {...mockProps} />);

    // Check if all view mode tabs are rendered
    expect(screen.getByText('Table')).toBeInTheDocument();
    expect(screen.getByText('Split')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();

    // Check if icons are rendered
    expect(screen.getByTestId('icon-lucide:table')).toBeInTheDocument();
    expect(screen.getByTestId('icon-lucide:layout-grid')).toBeInTheDocument();
    expect(screen.getByTestId('icon-lucide:map')).toBeInTheDocument();
    expect(screen.getByTestId('icon-lucide:bar-chart-2')).toBeInTheDocument();
  });

  it('shows the correct selected view mode', () => {
    render(<ViewModeToggle {...mockProps} />);

    // The table tab should be selected
    const tableTab = screen.getByRole('tab', { name: /table/i });
    expect(tableTab).toHaveAttribute('aria-selected', 'true');
  });

  it('calls setViewMode when a different view mode is selected', () => {
    render(<ViewModeToggle {...mockProps} />);

    // Click on the map view mode
    const mapTab = screen.getByRole('tab', { name: /map/i });
    fireEvent.click(mapTab);

    expect(mockProps.setViewMode).toHaveBeenCalledWith('map');
  });

  it('renders theme switch and GitHub link on desktop', () => {
    render(<ViewModeToggle {...mockProps} />);

    // Check if theme switch is rendered
    expect(screen.getByTestId('theme-switch')).toBeInTheDocument();

    // Check if GitHub link is rendered with correct attributes
    const githubLink = screen.getByRole('link', { name: /view on github/i });
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders mobile menu button on small screens', () => {
    // Mock window.matchMedia to simulate small screen
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(max-width: 640px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    render(<ViewModeToggle {...mockProps} />);

    // Check if mobile menu button is rendered
    const mobileMenuButton = screen.getByRole('button', { name: /more options/i });
    expect(mobileMenuButton).toBeInTheDocument();

    // Click mobile menu button to open popover
    fireEvent.click(mobileMenuButton);

    // Check if mobile menu content is rendered
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('View on GitHub')).toBeInTheDocument();
  });

  it('maintains accessibility attributes', () => {
    render(<ViewModeToggle {...mockProps} />);

    // Check if tabs have proper ARIA labels
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'View mode options');

    // Check if GitHub button has proper ARIA label
    expect(screen.getByRole('link', { name: /view on github/i })).toHaveAttribute(
      'aria-label',
      'View on GitHub',
    );

    // Check if mobile menu button has proper ARIA label
    const mobileMenuButton = screen.getByRole('button', { name: /more options/i });
    expect(mobileMenuButton).toHaveAttribute('aria-label', 'More options');
  });
});

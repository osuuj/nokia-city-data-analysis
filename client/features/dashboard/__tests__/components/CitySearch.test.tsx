import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { CitySearch } from '../../components/controls/CitySearch';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('CitySearch', () => {
  const mockRouter = {
    replace: jest.fn(),
  };

  const mockProps = {
    cities: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu'],
    selectedCity: 'Helsinki',
    onCityChange: jest.fn(),
    isLoading: false,
    searchTerm: '',
    onSearchChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders with initial props', () => {
    render(<CitySearch {...mockProps} />);

    // Check if the autocomplete input is rendered with correct label
    expect(screen.getByLabelText('Search by city')).toBeInTheDocument();

    // Check if the selected city is displayed
    expect(screen.getByRole('combobox')).toHaveValue('Helsinki');
  });

  it('filters cities based on search term', async () => {
    const props = {
      ...mockProps,
      searchTerm: 'tam',
    };

    render(<CitySearch {...props} />);

    // Open the dropdown
    const input = screen.getByRole('combobox');
    fireEvent.click(input);

    // Check if only matching cities are displayed
    await waitFor(() => {
      expect(screen.getByText('Tampere')).toBeInTheDocument();
      expect(screen.queryByText('Helsinki')).not.toBeInTheDocument();
    });
  });

  it('calls onSearchChange when input changes', () => {
    render(<CitySearch {...mockProps} />);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'esp' } });

    expect(mockProps.onSearchChange).toHaveBeenCalledWith('esp');
  });

  it('calls onCityChange and updates URL when city is selected', async () => {
    render(<CitySearch {...mockProps} />);

    // Open the dropdown
    const input = screen.getByRole('combobox');
    fireEvent.click(input);

    // Select a different city
    const cityOption = screen.getByText('Espoo');
    fireEvent.click(cityOption);

    expect(mockProps.onCityChange).toHaveBeenCalledWith('Espoo');
    expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard?city=Espoo');
  });

  it('shows loading state', () => {
    const props = {
      ...mockProps,
      isLoading: true,
    };

    render(<CitySearch {...props} />);

    // Check if loading indicator is shown
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles empty cities array', () => {
    const props = {
      ...mockProps,
      cities: [],
    };

    render(<CitySearch {...props} />);

    // Open the dropdown
    const input = screen.getByRole('combobox');
    fireEvent.click(input);

    // Check if no cities are displayed
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('maintains accessibility features', () => {
    render(<CitySearch {...mockProps} />);

    // Check if the input has proper ARIA attributes
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');

    // Open the dropdown
    fireEvent.click(input);

    // Check if the input's expanded state is updated
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });
});

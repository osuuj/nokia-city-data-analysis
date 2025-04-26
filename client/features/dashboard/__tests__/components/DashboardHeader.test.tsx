import type { ViewMode } from '@/features/dashboard/types/view';
import { fireEvent, render, screen } from '@testing-library/react';
import { DashboardHeader } from '../../components/controls/DashboardHeader';

// Mock the useCompanyStore hook
jest.mock('../../store/useCompanyStore', () => ({
  useCompanyStore: () => ({
    selectedCity: 'Helsinki',
    setSelectedCity: jest.fn(),
    selectedRows: [],
    setSelectedRows: jest.fn(),
  }),
}));

describe('DashboardHeader', () => {
  const mockProps = {
    viewMode: 'table' as ViewMode,
    setViewMode: jest.fn(),
    cities: ['Helsinki', 'Espoo', 'Tampere'],
    selectedCity: 'Helsinki',
    onCityChange: jest.fn(),
    cityLoading: false,
    searchTerm: '',
    onSearchChange: jest.fn(),
  };

  it('renders correctly with initial props', () => {
    render(<DashboardHeader {...mockProps} />);

    // Check if the view mode toggle is rendered
    expect(screen.getByRole('button', { name: /table/i })).toBeInTheDocument();

    // Check if the city search is rendered with the correct value
    expect(screen.getByRole('combobox')).toHaveValue('Helsinki');
  });

  it('handles city selection change', () => {
    render(<DashboardHeader {...mockProps} />);

    const citySelect = screen.getByRole('combobox');
    fireEvent.change(citySelect, { target: { value: 'Espoo' } });

    expect(mockProps.onCityChange).toHaveBeenCalledWith('Espoo');
  });

  it('handles view mode change', () => {
    render(<DashboardHeader {...mockProps} />);

    const mapButton = screen.getByRole('button', { name: /map/i });
    fireEvent.click(mapButton);

    expect(mockProps.setViewMode).toHaveBeenCalledWith('map');
  });

  it('hides city search when in map or analytics view', () => {
    const mapProps = { ...mockProps, viewMode: 'map' as ViewMode };
    render(<DashboardHeader {...mapProps} />);

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('renders all available cities in the dropdown', () => {
    render(<DashboardHeader {...mockProps} />);

    const citySelect = screen.getByRole('combobox');
    const options = Array.from(citySelect.getElementsByTagName('option'));

    expect(options).toHaveLength(mockProps.cities.length);
    for (const city of mockProps.cities) {
      expect(screen.getByText(city)).toBeInTheDocument();
    }
  });
});

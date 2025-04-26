import { fireEvent, render, screen } from '@/__tests__/utils/test-utils';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';

describe('DashboardHeader', () => {
  it('renders correctly', () => {
    render(<DashboardHeader />);

    // Check if header elements are rendered
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view mode/i })).toBeInTheDocument();
  });

  it('toggles view mode when button is clicked', () => {
    render(<DashboardHeader />);

    // Get the view mode button
    const viewModeButton = screen.getByRole('button', { name: /view mode/i });

    // Check initial state
    expect(viewModeButton).toHaveTextContent(/table/i);

    // Click the button
    fireEvent.click(viewModeButton);

    // Check if the view mode has changed
    expect(viewModeButton).toHaveTextContent(/map/i);
  });
});

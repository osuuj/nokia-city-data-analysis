import React from 'react';
import { DashboardErrorMessage } from '../../components/shared/DashboardErrorMessage';
import { fireEvent, render, screen } from '../utils/test-utils';

describe('DashboardErrorMessage', () => {
  it('renders with title and message', () => {
    render(<DashboardErrorMessage title="Error Title" message="Error message" />);

    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders with retry button when onRetry is provided', () => {
    const handleRetry = jest.fn();

    render(
      <DashboardErrorMessage title="Error Title" message="Error message" onRetry={handleRetry} />,
    );

    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<DashboardErrorMessage title="Error Title" message="Error message" />);

    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('renders with additional details when provided', () => {
    render(
      <DashboardErrorMessage
        title="Error Title"
        message="Error message"
        details="Additional error details"
      />,
    );

    expect(screen.getByText('Additional error details')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(
      <DashboardErrorMessage
        title="Error Title"
        message="Error message"
        className="custom-error-class"
      />,
    );

    const errorContainer = screen.getByTestId('error-message');
    expect(errorContainer).toHaveClass('custom-error-class');
  });
});

import React from 'react';
import { render, screen } from '../../../__tests__/utils/test-utils';
import Dashboard from '../../components/Dashboard';

describe('Dashboard', () => {
  it('renders without crashing', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Welcome to the Dashboard/i)).toBeInTheDocument();
  });
});

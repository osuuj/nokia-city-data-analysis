import React from 'react';
import { BaseCard } from '../../components/shared/BaseCard';
import { render, screen } from '../utils/test-utils';

describe('BaseCard', () => {
  it('renders with title and children', () => {
    render(
      <BaseCard title="Test Card">
        <div>Card Content</div>
      </BaseCard>,
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders with loading state', () => {
    render(
      <BaseCard title="Test Card" isLoading={true}>
        <div>Card Content</div>
      </BaseCard>,
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.queryByText('Card Content')).not.toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders with error state', () => {
    const error = {
      name: 'Error',
      message: 'Test error message',
    };

    render(
      <BaseCard title="Test Card" error={error}>
        <div>Card Content</div>
      </BaseCard>,
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.queryByText('Card Content')).not.toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <BaseCard title="Test Card" className="custom-class">
        <div>Card Content</div>
      </BaseCard>,
    );

    const card = screen.getByTestId('base-card');
    expect(card).toHaveClass('custom-class');
  });

  it('renders with actions', () => {
    render(
      <BaseCard title="Test Card" actions={<button type="button">Action Button</button>}>
        <div>Card Content</div>
      </BaseCard>,
    );

    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('renders with footer', () => {
    render(
      <BaseCard title="Test Card" footer={<div>Footer Content</div>}>
        <div>Card Content</div>
      </BaseCard>,
    );

    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });
});

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { BaseCard } from '../../components/shared/BaseCard';

describe('BaseCard', () => {
  it('renders title and content correctly', () => {
    render(
      <BaseCard title="Test Card">
        <div>Test Content</div>
      </BaseCard>,
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <BaseCard title="Test Card" isLoading>
        <div>Test Content</div>
      </BaseCard>,
    );

    // The loading spinner should be visible
    expect(screen.getByRole('status')).toBeInTheDocument();
    // Content should not be visible during loading
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('shows error state', () => {
    const error = new Error('Test error message');
    render(
      <BaseCard title="Test Card" error={error}>
        <div>Test Content</div>
      </BaseCard>,
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('shows empty state message', () => {
    render(
      <BaseCard title="Test Card" emptyMessage="No data available">
        {[]}
      </BaseCard>,
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders header content', () => {
    render(
      <BaseCard title="Test Card" headerContent={<button type="button">Action</button>}>
        <div>Test Content</div>
      </BaseCard>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom class names', () => {
    const { container } = render(
      <BaseCard
        title="Test Card"
        className="test-class"
        headerClassName="header-class"
        bodyClassName="body-class"
      >
        <div>Test Content</div>
      </BaseCard>,
    );

    expect(container.firstChild).toHaveClass('test-class');
    expect(screen.getByText('Test Card').parentElement).toHaveClass('header-class');
    expect(screen.getByText('Test Content').parentElement).toHaveClass('body-class');
  });

  it('renders custom loading component', () => {
    render(
      <BaseCard title="Test Card" isLoading loadingComponent={<div>Custom Loading...</div>}>
        <div>Test Content</div>
      </BaseCard>,
    );

    expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
  });

  it('renders custom error component', () => {
    render(
      <BaseCard
        title="Test Card"
        error={new Error('Test error')}
        errorComponent={<div>Custom Error</div>}
      >
        <div>Test Content</div>
      </BaseCard>,
    );

    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });

  it('toggles divider visibility', () => {
    const { container: withDivider } = render(
      <BaseCard title="Test Card" showDivider>
        <div>Test Content</div>
      </BaseCard>,
    );

    const { container: withoutDivider } = render(
      <BaseCard title="Test Card" showDivider={false}>
        <div>Test Content</div>
      </BaseCard>,
    );

    expect(withDivider.querySelector('.my-1')).toBeInTheDocument();
    expect(withoutDivider.querySelector('.my-1')).not.toBeInTheDocument();
  });
});

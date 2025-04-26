import { fireEvent, render, screen } from '@/__tests__/utils/test-utils';
import { Button } from '@/shared/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);

    // Check if button is rendered
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    // Click the button
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));

    // Check if the onClick handler was called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="primary">Primary Button</Button>);

    // Check if the button has the primary variant class
    expect(screen.getByRole('button', { name: /primary button/i })).toHaveClass('bg-primary');
  });

  it('applies size classes correctly', () => {
    render(<Button size="lg">Large Button</Button>);

    // Check if the button has the large size class
    expect(screen.getByRole('button', { name: /large button/i })).toHaveClass('text-lg');
  });
});

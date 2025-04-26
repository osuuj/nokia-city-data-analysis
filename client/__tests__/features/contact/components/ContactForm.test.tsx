import { fireEvent, render, screen } from '@/__tests__/utils/test-utils';
import { ContactForm } from '@/features/contact/components/ContactForm';

describe('ContactForm', () => {
  it('renders correctly', () => {
    render(<ContactForm />);

    // Check if form elements are rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('submits the form correctly', async () => {
    // Mock the form submission
    const mockSubmit = jest.fn();
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        headers: new Headers(),
        redirected: false,
        status: 200,
        statusText: 'OK',
        type: 'default',
        url: '',
        clone: () => new Response(),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(''),
      } as Response),
    );

    render(<ContactForm />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Hello, this is a test message.' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // Check if the form was submitted
    expect(global.fetch).toHaveBeenCalled();
  });
});

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';

interface AboutErrorBoundaryProps {
  children: React.ReactNode;
}

interface AboutErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class AboutErrorBoundary extends React.Component<
  AboutErrorBoundaryProps,
  AboutErrorBoundaryState
> {
  constructor(props: AboutErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): AboutErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('About Error Boundary caught an error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6 text-danger">
            <Icon icon="mdi:alert-circle" className="text-6xl" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-content2 mb-6 max-w-md">
            We encountered an error while loading this page. Please try refreshing or contact
            support if the problem persists.
          </p>
          <div className="flex gap-4">
            <Button
              color="primary"
              variant="flat"
              startContent={<Icon icon="mdi:refresh" />}
              onPress={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            <Button
              color="default"
              variant="flat"
              startContent={<Icon icon="mdi:home" />}
              onPress={() => {
                window.location.href = '/';
              }}
            >
              Go to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

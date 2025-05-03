import { AnimatedBackground } from '@/shared/components/ui/AnimatedBackground';

/**
 * Component displayed when no resources are available.
 */
export function ResourcesEmpty() {
  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      <AnimatedBackground />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4">No Resources Available</h1>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            There are no resources available at the moment. Please check back later.
          </p>
        </div>
      </div>
    </div>
  );
}

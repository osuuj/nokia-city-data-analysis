import { Hero } from '@/components/ui/Hero/Hero';
import { Preloader } from '@/components/ui/Preloader';

/**
 * Landing page component displaying the hero section.
 * This is the root of the app's public-facing homepage.
 */
export default function LandingPage() {
  return (
    <>
      <Preloader />
      <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Hero />
      </section>
    </>
  );
}

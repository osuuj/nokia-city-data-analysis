'use client';

import { ButtonStart } from '@/components/ui/Button';
import { siteConfig } from '@/config';

/**
 * Hero Component
 *
 * Displays a fullscreen landing section with background video, heading text,
 * description, and a call-to-action button.
 *
 * @returns {JSX.Element} The rendered Hero section.
 */
export const Hero = (): JSX.Element => {
  return (
    <div className="relative h-[calc(100vh-24rem)] w-full overflow-hidden">
      {/* 🔹 Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-placeholder.png"
        className="absolute left-0 top-0 h-full w-full object-cover"
      >
        <source src="videos/background.mp4" type="video/mp4" />
      </video>

      {/* 🔹 Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* 🔹 Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4 sm:px-6 md:px-8">
        <div className="inline-block max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {siteConfig.hero.title.before}
            <span className="text-violet-500">{siteConfig.hero.title.highlight}</span>
            {siteConfig.hero.title.after}
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg">{siteConfig.hero.description}</p>

          {/* 🔹 Call-to-Action Button */}
          <div className="mt-8">
            <ButtonStart label="Start Exploring" href="/home" />
          </div>
        </div>
      </div>
    </div>
  );
};

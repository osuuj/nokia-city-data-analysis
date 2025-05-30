'use client';

import { type FC, useEffect, useRef, useState } from 'react';

/**
 * Props for the HeroVideo component.
 */
export interface HeroVideoProps {
  /** Callback function to execute when the video has an error */
  onVideoError: () => void;
}

/**
 * HeroVideo Component
 *
 * Displays a video background for the Hero section.
 *
 * @example
 * <HeroVideo onVideoError={() => console.log('Video error')} />
 */
export const HeroVideo: FC<HeroVideoProps> = ({ onVideoError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasError, setHasError] = useState(false);

  // We always use desktop video for initial render to avoid hydration mismatches
  // Then switch to mobile if needed after client-side mounting
  const videoSrc = !isMounted
    ? '/videos/background.mp4'
    : isMobile
      ? '/videos/background-mobile.mp4'
      : '/videos/background.mp4';

  const captionSrc = !isMounted
    ? '/videos/background.vtt'
    : isMobile
      ? '/videos/background-mobile.vtt'
      : '/videos/background.vtt';

  const posterSrc = isMobile ? '/videos/mobile-poster.svg' : '/videos/desktop-poster.svg';

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
    // Check if mobile
    setIsMobile(window.innerWidth <= 768);

    // Add resize listener
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle video loading and errors
  useEffect(() => {
    if (!isMounted) return;

    if (videoRef.current) {
      // Add event listeners for video loading and errors
      const video = videoRef.current;

      const handleLoadedData = () => {
        // Video has loaded successfully
        if (video.play) {
          const playPromise = video.play();

          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error('Error playing video:', error);
              handleError();
            });
          }
        }
      };

      const handleError = () => {
        console.error('Error loading video');
        setHasError(true);
        onVideoError();
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      // Clean up event listeners
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [onVideoError, isMounted]);

  if (hasError) {
    return null;
  }

  return (
    <div className="video-container">
      {/* SVG background for immediate display */}
      <img
        src={posterSrc}
        alt="Background"
        className="absolute left-0 top-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterSrc}
        className="absolute left-0 top-0 h-full w-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        <track kind="captions" src={captionSrc} srcLang="en" label="English" />
        Your browser does not support the video tag.
      </video>
      <div
        className="video-overlay absolute inset-0 bg-black bg-opacity-40"
        aria-hidden="true"
        role="presentation"
      />
    </div>
  );
};

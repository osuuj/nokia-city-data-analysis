'use client';

import { type FC, useCallback, useEffect, useRef, useState } from 'react';

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
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video loading and errors
  useEffect(() => {
    if (videoRef.current) {
      // Add event listeners for video loading and errors
      const video = videoRef.current;

      const handleLoadedData = () => {
        // Video has loaded successfully
        console.log('Video loaded successfully');
      };

      const handleError = () => {
        console.error('Error loading video');
        setVideoError(true);
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
  }, [onVideoError]);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
    onVideoError();
  }, [onVideoError]);

  if (videoError) {
    return null;
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute left-0 top-0 h-full w-full object-cover"
        onError={handleVideoError}
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        aria-hidden="true"
        role="presentation"
      />
    </>
  );
};

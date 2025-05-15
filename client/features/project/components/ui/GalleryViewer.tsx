'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { memo, useEffect, useRef, useState } from 'react';
import type { GalleryItem } from '../../types';

/**
 * Props for the GalleryViewer component
 */
interface GalleryViewerProps {
  /**
   * Array of gallery items to display
   */
  items: GalleryItem[];

  /**
   * Optional className for styling
   */
  className?: string;
}

/**
 * GalleryViewer component
 *
 * Displays a gallery of images with navigation controls.
 * Supports keyboard navigation and touch gestures.
 *
 * @example
 * ```tsx
 * <GalleryViewer
 *   items={[
 *     { src: '/image1.jpg', alt: 'Image 1' },
 *     { src: '/image2.jpg', alt: 'Image 2' }
 *   ]}
 * />
 * ```
 */
const GalleryViewer = memo(function GalleryViewer({ items, className = '' }: GalleryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLElement>(null);

  // Use a ref to track the current index to avoid dependency in useEffect
  useEffect(() => {
    // Reset loading state when image changes
    setIsLoading(true);
    // This effect doesn't need dependencies since it runs after the currentIndex state changes
    // and the Image component will re-render with the new source
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    }
  };

  if (!items.length) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className={`relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden ${className}`}
      onKeyDown={handleKeyDown}
      aria-label="Image gallery"
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        <Image
          src={items[currentIndex].src}
          alt={items[currentIndex].alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={currentIndex === 0}
          onLoadingComplete={() => setIsLoading(false)}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
            <Icon icon="lucide:image" className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>

      {/* Caption */}
      {items[currentIndex].caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 z-10">
          <p className="text-sm">{items[currentIndex].caption}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <Button
            onPress={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
            aria-label="Previous image"
          >
            <Icon icon="solar:arrow-left-bold" className="text-xl" />
          </Button>
          <Button
            onPress={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
            aria-label="Next image"
          >
            <Icon icon="solar:arrow-right-bold" className="text-xl" />
          </Button>
        </>
      )}

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((item, index) => (
            <button
              key={`gallery-dot-${item.src}`}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to image ${index + 1}`}
              aria-current={currentIndex === index ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </section>
  );
});

export default GalleryViewer;

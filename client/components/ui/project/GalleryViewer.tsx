'use client';

import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface GalleryViewerProps {
  gallery: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  projectTitle: string;
  'aria-labelledby'?: string;
}

export default function GalleryViewer({
  gallery,
  projectTitle,
  'aria-labelledby': ariaLabelledBy,
}: GalleryViewerProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;

    if (direction === 'prev') {
      setSelectedImage(selectedImage === 0 ? gallery.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage(selectedImage === gallery.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      aria-labelledby={ariaLabelledBy}
    >
      {gallery.map((image, index) => {
        const imageId = image.src.substring(image.src.lastIndexOf('/') + 1);
        return (
          <motion.div
            key={`gallery-${imageId}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card
              isPressable
              onPress={() => openLightbox(index)}
              className="overflow-hidden group relative"
              aria-label={`View ${image.alt} in full screen`}
            >
              <div className="flex flex-col relative text-foreground box-border bg-content1 outline-none data-[hover=true]:bg-content2 transition-colors">
                <div className="flex w-full items-center justify-center p-4">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                    <button
                      type="button"
                      className="z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(index);
                      }}
                      aria-label="View image in full screen"
                    >
                      <Icon icon="solar:gallery-add-bold" width={24} />
                    </button>
                  </div>
                </div>
                {image.caption && (
                  <div className="px-4 py-2 text-sm text-default-500">{image.caption}</div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            type="button"
            className="absolute top-4 right-4 text-white hover:text-primary"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <Icon icon="solar:close-circle-bold" width={32} />
          </button>

          <button
            type="button"
            className="absolute left-4 text-white hover:text-primary"
            onClick={() => navigateImage('prev')}
            aria-label="Previous image"
          >
            <Icon icon="solar:arrow-left-bold" width={32} />
          </button>

          <button
            type="button"
            className="absolute right-4 text-white hover:text-primary"
            onClick={() => navigateImage('next')}
            aria-label="Next image"
          >
            <Icon icon="solar:arrow-right-bold" width={32} />
          </button>

          <div className="max-w-4xl max-h-[80vh] p-4">
            <img
              src={gallery[selectedImage].src}
              alt={gallery[selectedImage].alt}
              className="max-h-full max-w-full object-contain"
            />
            {gallery[selectedImage].caption && (
              <div className="mt-4 text-center text-white">{gallery[selectedImage].caption}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
